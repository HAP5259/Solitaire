import React from 'react';
import { useGame } from '../hooks/useGame.js';

export default function ControlsBar() {
    const { autoMoveToFoundation, resetGame } = useGame();

    return (
        <div className="flex gap-2 mb-4">
            <button
                onClick={autoMoveToFoundation}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Auto Move
            </button>
            <button
                onClick={resetGame}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
                New Game
            </button>
        </div>
    );
}
