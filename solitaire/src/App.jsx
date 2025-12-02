/**
 * The main App component - everything starts here
 * 
 * Sets up:
 * - GameProvider so all the components can talk to the game state
 * 
 * Layout:
 * - Dark background (looks nicer than plain white)
 * - Game board in the center
 * - Scrolls if your screen is too small
 * 
 * The drag-and-drop wrapper (DndProvider) is in index.js
 */
import { GameProvider } from './hooks/useGame.js';
import GameBoard from './components/GameBoard.jsx';

export default function App() {
    return (
        <GameProvider>
            <div className="min-h-screen w-full flex items-start justify-center bg-slate-900 overflow-auto p-4">
              <div className="w-full">
                <GameBoard />
              </div>
            </div>
        </GameProvider>
    );
}
