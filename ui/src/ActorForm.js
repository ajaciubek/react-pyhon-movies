import {useState} from "react";
import {calculateNewValue} from "@testing-library/user-event/dist/utils";

export default function ActorForm(props) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [selectedMovies, setsSelectedMovies] = useState([]);

    function addActor(event) {
        event.preventDefault();
        props.onActorSubmit({'name' : name, 'surname' : surname, 'movies' : selectedMovies});

        setName('');
        setSurname('');
        setsSelectedMovies([])
    }

    const handleMovieChange = (event) => {
        const options = event.target.selectedOptions; // Get selected options
        const values = Array.from(options).map(option => option.value); // Get value of selected options
        setsSelectedMovies(values); // Update the state with selected values
    };
    return <form onSubmit={addActor}>
        <h2>Dodaj aktora</h2>
        <div>
            <label>Imie</label>
            <input type="text" value={name} onChange={(event) =>  setName(event.target.value)}/>
        </div>
        <div>
            <label>Nazwisko</label>
            <input type="text" value={surname} onChange={(event) => setSurname(event.target.value)}/>
        </div>
        <div>
            <label>Filmy</label>
            <select name="movies" onChange={(event) => handleMovieChange(event)} multiple>
                {props.movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
            </select>
        </div>
        <button>{props.buttonLabel || 'Submit'}</button>
    </form>;
}
