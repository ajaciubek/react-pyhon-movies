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
    const [searchMovieValue, setSearchMovieValue] = useState('');
    const [allMovies, setAllMovies] = useState([]);

    useEffect(() => {
    const fetchMovies = async () => {
        const response_all = await fetch(`/movies`);
        if (response_all.ok) {
            const allMovies = await response_all.json();
            setAllMovies(allMovies);
        }

        const response = await fetch(`/search?query=${searchMovieValue}`);
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

    async function handleSearchMovieChange(newValue){
        setSearchMovieValue(newValue);
        const response = await fetch(`/search?query=${newValue}`);
        if (response.ok) {
            const movies = await response.json();
            setMovies(movies);
        }
      };

    async function handleAddMovie(movie) {
      const response = await fetch('/movies', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
            const created_movie = await response.json();
            setAllMovies([...allMovies, created_movie]);
            const search_response = await fetch(`/search?query=${searchMovieValue}`);
            if (search_response.ok) {
                const movies = await search_response.json();
                setMovies(movies);
            }
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
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            const search_response = await fetch(`/search?query=${searchMovieValue}`);
            if (search_response.ok) {
                const movies = await search_response.json();
                setMovies(movies);
            }
        }
    }

    async function handleDeleteMovie(movie) {
        const response = await fetch(`/movies/${movie.id}`, {
        method: 'DELETE',
      });
        if (response.ok) {
            setMovies(movies.filter(m => m.id !== movie.id));
            setAllMovies(allMovies.filter(m => m.id !== movie.id))
        }
    }

    async function handleDeleteActor(actor) {
        const response = await fetch(`/actors/${actor.id}`, {
        method: 'DELETE',
      });
        if (response.ok) {
            const nextActors = actors.filter(a => a.id !== actor.id);
            setActors(nextActors);
            const response = await fetch(`/search?query=${searchMovieValue}`);
            if (response.ok) {
                const movies = await response.json();
                setMovies(movies);
            }
        }
    }

    return (
        <div className="container">
            <strong>Baza filmów</strong>
            <input type="text" value={searchMovieValue} onChange={(event) =>  handleSearchMovieChange(event.target.value)} placeholder='Wyszukaj film...'/>

            {movies.length === 0
                ? <div></div>
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
                             movies={allMovies}
                />
                : <button onClick={() => setAddingActor(true)}>Dodaj aktora</button>}
        </div>
    );
}

export default App;
