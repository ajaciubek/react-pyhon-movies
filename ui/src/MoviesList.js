import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
    return <div>
        <h2>Filmy:</h2>
        <ul className="movies-list">
            {props.movies.map(movie => <li key={movie.title}>
                {console.log("single movie: " + movie.actors)}
                <MovieListItem movie={movie} onDelete={() => props.onDeleteMovie(movie)}/>
            </li>)}
        </ul>
    </div>;
}
