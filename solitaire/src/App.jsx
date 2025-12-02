import { GameProvider } from './hooks/useGame.js';
import GameBoard from './components/GameBoard.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <GameProvider>
                <div className="min-h-screen w-full flex items-start justify-center bg-slate-900 overflow-auto p-4">
                  <div className="w-full">
                    <GameBoard />
                  </div>
                </div>
            </GameProvider>
        </DndProvider>
    );
}
