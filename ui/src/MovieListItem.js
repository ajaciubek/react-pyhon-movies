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
                {/*    {actor.name} {actor.surname}*/}
                {/*</li>)}*/}
                {props.movie.actors.map(actor =>
                    <span> {actor.name} {actor.surname}</span>
                )}
                <a onClick={props.onDelete}>Usuń</a>
            </div>
            {props.movie.description}
        </div>
    );
}
