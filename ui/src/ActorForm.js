import {useState} from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function ActorForm(props) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [selectedMovies, setSelectedMovies] = useState([]);

    function addActor(event) {
        event.preventDefault();
        props.onActorSubmit({'name' : name, 'surname' : surname, 'movies' : selectedMovies});
        setName('');
        setSurname('');
        setSelectedMovies([])
    }

    const handleMovieChange = (selectedMovies) => {
        const values = Array.from(selectedMovies).map(movie => movie.id); // Get value of selected options  
        setSelectedMovies(values); // Update the state with selected values
    };

    return <form onSubmit={addActor}>
            <Stack spacing={3} sx={{ width: 500 }}>

        <h2>Dodaj aktora</h2>
            <label>Imie:</label>
            <input type="text" value={name} onChange={(event) =>  setName(event.target.value)}/>
            <label>Nazwisko:</label>
            <input type="text" value={surname} onChange={(event) => setSurname(event.target.value)}/>
            <label>Filmy:</label>
            <Autocomplete
                multiple
                id="actor-movies"
                options={props.movies}
                getOptionLabel={(option) => option.title}
                onChange={(event, newValues) => handleMovieChange(newValues)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                    />
                )}
            />
        <button>{props.buttonLabel || 'Submit'}</button>
        </Stack>
    </form>;
}
