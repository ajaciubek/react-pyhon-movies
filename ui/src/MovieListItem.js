export default function MovieListItem(props) {
    return (
        <div>
            <div>
                <strong>{props.movie.title}</strong>
                {' '}
                <span>({props.movie.year})</span>
                {' '}
                reżyseria: {props.movie.director}
                {' '}
                aktorzy:
                {/*{props.movie.actors.map(actor => <li key={actor.id}>*/}
                {/*    {actor.name}*/}
                {/*</li>)}*/}
                <a onClick={props.onDelete}>Usuń</a>
            </div>
            {props.movie.description}
        </div>
    );
}
