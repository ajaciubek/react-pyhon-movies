from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import schemas
import models

app = FastAPI()
app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")


@app.get("/")
def serve_react_app():
    return FileResponse("../ui/build/index.html")


@app.get("/movies", response_model=List[schemas.Movie])
def get_movies():
    return list(models.Movie.select())


@app.post("/movies", response_model=schemas.Movie)
def add_movie(movie: schemas.MovieBase):
    movie = models.Movie.create(**movie.dict())
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
    return actor_to_delete