import {useState} from "react";

export default function ActorForm(props) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [movie, setMovie] = useState('');

    function addActor(event) {
        event.preventDefault();

        props.onActorSubmit({name, surname, movie});

        setName('');
        setSurname('');
        setMovie()
    }

    return <form onSubmit={addActor}>
        <h2>Dodaj aktora</h2>
        <div>
            <label>Imie</label>
            <input type="text" value={name} onChange={(event) => setName(event.target.value)}/>
        </div>
        <div>
            <label>Nazwisko</label>
            <input type="text" value={surname} onChange={(event) => setSurname(event.target.value)}/>
        </div>
        <div>
            <label htmlFor="cars">Film</label>
            <select name="cars" id="cars">
                <option value="">- Film --</option>
                {props.movies.map((movie) => (
                  <option key={movie.id} value={movie.title} onChange={(event) => setMovie(movie.title)}>
                    {movie.title}
                  </option>
                ))}
            </select>
        </div>
        <button>{props.buttonLabel || 'Submit'}</button>
    </form>;
}
