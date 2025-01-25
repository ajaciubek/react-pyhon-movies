export default function ActorListItem(props) {
    return (
        <div>
            <div>
                <strong>{props.actor.name}</strong>
                {' '}
                <strong>{props.actor.surname} </strong>
                <a onClick={props.onDelete}>Usuń</a>
            </div>
        </div>
    );
}
