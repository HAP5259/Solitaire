import { GameProvider } from './hooks/useGame.js';
import GameBoard from './components/GameBoard.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <GameProvider>
                <div className="min-h-screen flex items-center justify-center bg-slate-900">
                  <div className="p-6 rounded-xl bg-white shadow-xl">
                    <p className="mb-4 text-xl font-bold text-slate-800">Solitaire</p>
                    <GameBoard />
                  </div>
                </div>
            </GameProvider>
        </DndProvider>
    );
}
