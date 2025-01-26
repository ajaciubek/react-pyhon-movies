import './App.css';
import {useState} from "react";
import {useEffect} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import ActorForm from "./ActorForm"
import ActorList from "./ActorList"

function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [actors, setActors] = useState([])
    const [addingActor, setAddingActor] = useState(false);

    useEffect(() => {
    const fetchMovies = async () => {
        const response = await fetch(`/movies`);
        if (response.ok) {
            const movies = await response.json();
            setMovies(movies);
        }
    };
    fetchMovies();
    }, []);

    useEffect(() => {
    const fetchActors = async () => {
        const response = await fetch(`/actors`);
        if (response.ok) {
            const actors = await response.json();
            setActors(actors);
        }
    };
    fetchActors();
    }, []);

    async function handleAddMovie(movie) {
      const response = await fetch('/movies', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
          const created_movie = await response.json();
          setMovies([...movies, created_movie]);
          setAddingMovie(false);
      }
    }

    async function handleAddActor(actor) {
        const response = await fetch('/actors', {
            method: 'POST',
            body: JSON.stringify(actor),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const created_actor = await response.json();
            setActors([...actors, created_actor]);
            setAddingActor(false);

            for (const movie_id of actor['movies']){
                const response_movie = await fetch(`/movies/${movie_id}/${created_actor.id}`, {
                    method: 'POST',
                    body: JSON.stringify(actor),
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response_movie.ok){
                    const created_movie = await response_movie.json();
                    setMovies([...movies, created_movie]);
                    setAddingMovie(false);
                }
            }
        }


    }

    async function handleDeleteMovie(movie) {
        const response = await fetch(`/movies/${movie.id}`, {
        method: 'DELETE',
      });
        if (response.ok) {
        const nextMovies = movies.filter(m => m !== movie);
        setMovies(nextMovies);
        }
    }

    async function handleDeleteActor(actor) {
        const response = await fetch(`/actors/${actor.id}`, {
        method: 'DELETE',
      });
        if (response.ok) {
            const nextActors = actors.filter(m => m !== actor);
            setActors(nextActors);
        }
    }

    return (
        <div className="container">
            {movies.length === 0
                ? <p>Lista filmów pusta, może coś dodaj ?</p>
                : <MoviesList movies={movies}
                              onDeleteMovie={(movie) => handleDeleteMovie(movie)}
                />}
            {addingMovie
                ? <MovieForm onMovieSubmit={handleAddMovie}
                             buttonLabel="Dodaj film"
                />
                : <button onClick={() => setAddingMovie(true)}>Dodaj film</button>}
            <div></div>
            {actors.length === 0
                ? <p>Lista aktorów pusta, może coś dodaj ?</p>
                : <ActorList actors={actors}
                             onDeleteActor={(actor) => handleDeleteActor(actor)}
                />}
            {addingActor
                ? <ActorForm onActorSubmit={handleAddActor}
                             buttonLabel="Dodaj aktora"
                             movies={movies}
                />
                : <button onClick={() => setAddingActor(true)}>Dodaj aktora</button>}
        </div>
    );
}

export default App;
