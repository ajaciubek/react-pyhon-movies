import ActorListItem from "./ActorListItem";

export default function ActorList(props) {
    return <div>
        <h2>Aktorzy</h2>
        <ul className="actor-list">
            {props.actors.map(actor => <li key={actor.surname}>
                <ActorListItem actor={actor} onDelete={() => props.onDeleteActor(actor)}/>
            </li>)}
        </ul>
    </div>;
}
