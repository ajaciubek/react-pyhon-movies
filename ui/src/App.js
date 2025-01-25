import './App.css';
import {useState} from "react";
import {useEffect} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import ActorForm from "./ActorForm"
import ActorList from "./ActorList"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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
        setMovies([...movies, movie]);
        setAddingMovie(false);
      }
    }

    async function handleAddActor(actor) {
      console.log(actor)
      const response = await fetch('/actors', {
        method: 'POST',
        body: JSON.stringify(actor),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setActors([...actors, actor]);
        setAddingActor(false);
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
            <h1>Ulubione filmy:</h1>
            {movies.length === 0
                ? <p>Lista pusta, może coś dodaj ?</p>
                : <MoviesList movies={movies}
                              onDeleteMovie={(movie) => handleDeleteMovie(movie)}
                />}
            {addingMovie
                ? <MovieForm onMovieSubmit={handleAddMovie}
                             buttonLabel="Dodaj film"
                />
                : <button onClick={() => setAddingMovie(true)}>Dodaj film</button>}
            <h1>Ulubioni aktorzy:</h1>
            {addingActor
                ? <ActorForm onActorSubmit={handleAddActor}
                             buttonLabel="Dodaj aktora"
                             movies={movies}
                />
                : <button onClick={() => setAddingActor(true)}>Dodaj aktora</button>}
            {actors.length === 0
                ? <p>Lista pusta, może coś dodaj ?</p>
                : <ActorList actors={actors}
                             onDeleteActor={(actor) => handleDeleteActor(actor)}
                />}
        </div>
    );
}

export default App;
