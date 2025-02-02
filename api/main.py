from typing import List
import json
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct
from sentence_transformers import SentenceTransformer

import schemas
import models

def load_test_data():
    with open("movies.json", "r") as file:
        data = json.load(file)
        for movie in data['movies']:
            models.Movie.create(id= movie['id'], title=movie['title'], year=movie['year'], director=movie['director'], description=movie['plot'])

app = FastAPI()
app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")

qdrant_client = QdrantClient(
    url="https://92c8113b-a0d3-4941-bfeb-f31c4be2bbe2.europe-west3-0.gcp.cloud.qdrant.io:6333", 
    api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.5qkwtTjJLuijpKU9vVdgcvFdzKvRbFznc3hpwtvtF1c",
)

encoder = SentenceTransformer("all-MiniLM-L6-v2")

load_test_data()

@app.get("/")
def serve_react_app():
    return FileResponse("../ui/build/index.html")


@app.get("/movies", response_model=List[schemas.Movie])
def get_movies():
    return list(models.Movie.select())


@app.post("/movies", response_model=schemas.Movie)
def add_movie(movie: schemas.MovieBase):
    movie = models.Movie.create(**movie.dict())
    qdrant_client.upsert(
        collection_name="movies_2",
        wait=True,
        points=[PointStruct(id=movie.id, vector=encoder.encode(f"{movie.title} {movie.description}"), payload={"title": movie.title})],
    )
    return movie

@app.post("/movies/{movie_id}/{actor_id}", response_model=schemas.Movie)
def add_movie(movie_id:int, actor_id:int):
    try:
        actor = models.Actor.get(actor_id)
        movie = models.Movie.get(movie_id)
    except:
        raise HTTPException(status_code=404, detail="Data not found")

    movie.actors.add(actor)

    return movie

@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie


@app.delete("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    db_movie.delete_instance()
    models.ActorMovie.delete().where(models.ActorMovie.movie == movie_id).execute()
    qdrant_client.delete(
        collection_name="movies_2", 
        wait=True,
        points_selector = [movie_id]
    )
    return db_movie

@app.get("/actors", response_model=List[schemas.Actor])
def get_movies():
    return list(models.Actor.select())

@app.get("/actors/{actor_id}", response_model=schemas.Actor)
def get_movie(actor_id: int):
    try:
        movie = models.Actor.get(actor_id)
    except:
        raise HTTPException(status_code=404, detail="Actor not found")
    return movie

@app.post("/actors", response_model=schemas.Actor)
def add_movie(actor: schemas.ActorBase):
    added_actor = models.Actor.create(**actor.dict())
    return added_actor

@app.delete("/actors/{actor_id}", response_model=schemas.Actor)
def delete_movie(actor_id: int):
    actor_to_delete = models.Actor.get(models.Actor.id == actor_id)
    if actor_to_delete is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    actor_to_delete.delete_instance()
    models.ActorMovie.delete().where(models.ActorMovie.actor == actor_id).execute()
    return actor_to_delete

@app.get("/search", response_model=List[schemas.Movie])
def search_movies(query: str):
    if not query:
        return []
    search_result = qdrant_client.search(
        collection_name="movies_2", 
        query_vector=encoder.encode(query), 
        limit=3,
    )
    movies = models.Movie.select().where(models.Movie.id.in_([x.id for x in search_result]))
    return movies