import { useDrag } from 'react-dnd';
import { ItemTypes } from "../dndTypes.js";

export default function Card({ card, colIndex, cardIndex }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.CARD,
        item: { card, fromColumn: colIndex, fromIndex: cardIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [card, colIndex, cardIndex]);

    return (
            <button type="button" ref={drag} className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : '' }`}>
                <img class="w-16 md:w-20 lg:w-24"
                    src={card.faceUp ? `/cards/${card.rank}_of_${card.suit}.svg` : '/cards/back.png'}
                    alt={`${card.rank} of ${card.suit}`} />
            </button>
    )
}