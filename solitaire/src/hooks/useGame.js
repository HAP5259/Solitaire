import React, { createContext, useContext, useState } from 'react';
import { initGame } from '../logic/setup.js';
import { 
    canPlace, 
    canPlaceOnFoundation, 
    canDrawFromStock, 
    canRecycleWaste,
    isGameWon 
} from '../logic/rules.js';

const GameContext = createContext(null);

export function GameProvider({ children }) {
    const [gameState, setGameState] = useState(() => initGame());
    const { tableaus, foundations, stock, waste } = gameState;

    const setTableaus = (updater) => {
        setGameState((prev) => ({
            ...prev,
            tableaus: typeof updater === 'function' ? updater(prev.tableaus) : updater
        }));
    };

    const setFoundations = (updater) => {
        setGameState((prev) => ({
            ...prev,
            foundations: typeof updater === 'function' ? updater(prev.foundations) : updater
        }));
    };

    const setStock = (updater) => {
        setGameState((prev) => ({
            ...prev,
            stock: typeof updater === 'function' ? updater(prev.stock) : updater
        }));
    };

    const setWaste = (updater) => {
        setGameState((prev) => ({
            ...prev,
            waste: typeof updater === 'function' ? updater(prev.waste) : updater
        }));
    };

    const resetGame = () => {
        setGameState(initGame());
    };

    function moveCards(fromColumn, fromIndex, toColumn) {
        if (fromColumn === toColumn) return;
        setTableaus((prev) => {
            const newTableaus = prev.map((col) => [...col]);
            const source = newTableaus[fromColumn];
            const dest = newTableaus[toColumn];
            if (!source || !dest) return prev;

            const moving = source.slice(fromIndex);
            if (moving.length === 0) return prev;

            if (!canPlace(moving[0], dest)) return prev;

            newTableaus[fromColumn] = source.slice(0, fromIndex);

            newTableaus[toColumn] = dest.concat(moving.map((c) => ({ ...c, columnIndex: toColumn })));

            newTableaus[fromColumn].forEach((c, i) => { c.index = i; });
            newTableaus[toColumn].forEach((c, i) => { c.index = i; });

            const srcCol = newTableaus[fromColumn];
            if (srcCol.length > 0) {
                const last = srcCol[srcCol.length - 1];
                if (last && !last.faceUp) {
                    last.faceUp = true;
                }
            }

            return newTableaus;
        });
    }

    function drawOne() {
        setStock((prevStock) => {
            // Try to recycle waste if stock is empty
            if (canRecycleWaste(prevStock, waste)) {
                setWaste((prevWaste) => {
                    if (!prevWaste || prevWaste.length === 0) return [];
                    const newStock = prevWaste.map((c) => ({ ...c, faceUp: false }));
                    setStock(newStock);
                    return [];
                });
                return [];
            }

            // Draw from stock if available
            if (!canDrawFromStock(prevStock)) return prevStock;

            const newStock = prevStock.slice(0, -1);
            const drawn = prevStock[prevStock.length - 1];
            const toWaste = { ...drawn, faceUp: true };
            setWaste((prev) => [...prev, toWaste]);
            return newStock;
        });
    }

    function moveWasteToTableau(toColumn) {
        if (!waste || waste.length === 0) return;
        const top = waste[waste.length - 1];

        const dest = tableaus[toColumn] || [];
        if (!canPlace(top, dest)) return;

        setWaste((prevWaste) => prevWaste.slice(0, -1));

        setTableaus((prev) => {
            const newTableaus = prev.map((col) => [...col]);
            const destCol = newTableaus[toColumn] || [];
            const cardToMove = { ...top, columnIndex: toColumn, faceUp: true };
            newTableaus[toColumn] = destCol.concat(cardToMove);
            newTableaus[toColumn].forEach((c, i) => { c.index = i; });
            return newTableaus;
        });
    }

    function moveToFoundation(fromColumn, fromIndex, foundationIndex) {
        setTableaus((prevTableaus) => {
            const newTableaus = prevTableaus.map((col) => [...col]);
            const source = newTableaus[fromColumn];
            if (!source || fromIndex !== source.length - 1) return prevTableaus;

            const card = source[fromIndex];

            if (!canPlaceOnFoundation(card, foundations[foundationIndex])) return prevTableaus;

            setFoundations((prevFoundations) => {
                const newFoundations = prevFoundations.map((f) => [...f]);
                newFoundations[foundationIndex] = [...newFoundations[foundationIndex], { ...card }];
                return newFoundations;
            });

            newTableaus[fromColumn] = source.slice(0, fromIndex);
            newTableaus[fromColumn].forEach((c, i) => { c.index = i; });

            const srcCol = newTableaus[fromColumn];
            if (srcCol.length > 0) {
                const last = srcCol[srcCol.length - 1];
                if (last && !last.faceUp) {
                    last.faceUp = true;
                }
            }

            return newTableaus;
        });
    }

    function moveWasteToFoundation(foundationIndex) {
        if (!waste || waste.length === 0) return;
        const top = waste[waste.length - 1];

        if (!canPlaceOnFoundation(top, foundations[foundationIndex])) return;

        setWaste((prevWaste) => prevWaste.slice(0, -1));
        setFoundations((prevFoundations) => {
            const newFoundations = prevFoundations.map((f) => [...f]);
            newFoundations[foundationIndex] = [...newFoundations[foundationIndex], { ...top }];
            return newFoundations;
        });
    }

    function autoMoveToFoundation() {
        // Try to auto-move cards from tableau to foundation
        for (let col = 0; col < tableaus.length; col++) {
            const column = tableaus[col];
            if (column.length === 0) continue;
            const topCard = column[column.length - 1];
            if (!topCard.faceUp) continue;

            for (let f = 0; f < 4; f++) {
                if (canPlaceOnFoundation(topCard, foundations[f])) {
                    moveToFoundation(col, column.length - 1, f);
                    return true;
                }
            }
        }

        // Try to auto-move from waste to foundation
        if (waste && waste.length > 0) {
            const topWaste = waste[waste.length - 1];
            for (let f = 0; f < 4; f++) {
                if (canPlaceOnFoundation(topWaste, foundations[f])) {
                    moveWasteToFoundation(f);
                    return true;
                }
            }
        }

        return false;
    }

    const checkWin = () => {
        return isGameWon(foundations);
    };

    return (
        <GameContext.Provider value={{ 
            tableaus, 
            foundations, 
            stock, 
            waste, 
            moveCards, 
            drawOne, 
            moveWasteToTableau,
            moveToFoundation,
            moveWasteToFoundation,
            autoMoveToFoundation,
            resetGame,
            checkWin
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error('useGame must be used within GameProvider');
    return ctx;
}

export default useGame;
