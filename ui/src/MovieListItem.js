export default function MovieListItem(props) {
    return (
        <div>
            <div>
                <strong>{props.movie.title}</strong>
                {' '}
                <span>({props.movie.year})</span>
                {' '}
                <strong>reżyseria:</strong> {props.movie.director}
                {' '}
                {props.movie.actors.length > 0 && (
                    <>
                        <strong>aktorzy:</strong>
                        {props.movie.actors.map(actor =>
                            <span key={actor.id}> {actor.name} {actor.surname}</span>
                        )}
                    </>
                )}
                <a onClick={props.onDelete}>Usuń</a>
            </div>
            {props.movie.description}
        </div>
    );
}
