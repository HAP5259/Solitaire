import { useDrop } from "react-dnd";
import { ItemTypes } from "../dndTypes.js";
import Card from "./Card.jsx"; 
import { canPlace, onMoveCard} from "../logic/rules.js";

export default function Tableau({ cards, colIndex }) {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        canDrop: (item) => canPlace(item.card, cards),
        drop: (item) => onMoveCard(item, colIndex),
        collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
    }), [cards]);

    return (
        <div
            ref={drop}
            className={`w-20 md:w-24 lg:w-28 min-h-[6rem] rounded-md border-2 ${isOver && canDrop ? 'border-green-500' : 'border-transparent' }`}>
            {cards.map((c, i) => (
                <Card key={c.id} card={c} colIndex={colIndex} cardIndex={i} />
            ))}
        </div>
    );
}