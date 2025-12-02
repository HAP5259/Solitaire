/**
 * Make a standard 52-card deck (4 suits × 13 ranks)
 * All cards start face-down and aren't assigned to any pile yet
 * Each card gets a unique ID so React doesn't get confused
 */
function makeDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['ace','2','3','4','5','6','7','8','9','10','jack','queen','king'];
    const deck = [];
    let id = 1;
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ id: id++, suit, rank, faceUp: false, index: null, columnIndex: null });
        }
    }
    return deck;
}

/**
 * Shuffle the deck (Fisher-Yates shuffle - it's the legit way to randomize)
 * Goes through each card and swaps it with a random earlier position
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Set up a new game of Klondike Solitaire
 * 
 * What you get back:
 * - tableaus: the 7 columns with 1,2,3...7 cards (only the bottom one shows)
 * - foundations: 4 empty spots where you'll build Ace→King by suit
 * - stock: leftover cards you'll draw from (face-down pile)
 * - waste: starts empty (where drawn cards go)
 */
export function initGame() {
    const deck = shuffle(makeDeck());

    // Deal tableau: column i gets i+1 cards (column 0 gets 1, column 6 gets 7)
    const tableaus = Array.from({ length: 7 }, () => []);
    let offset = 0;
    for (let col = 0; col < 7; col++) {
        for (let i = 0; i <= col; i++) {
            const card = deck[offset++];
            card.columnIndex = col;
            card.index = i;
            card.faceUp = (i === col); // only the last card in each column is face-up
            tableaus[col].push(card);
        }
    }

    // Remaining cards go to stock pile
    const stock = deck.slice(offset).map((c) => ({ ...c }));
    const waste = [];

    // Four foundation piles start empty
    const foundations = Array.from({ length: 4 }, () => []);

    return { tableaus, foundations, stock, waste };
}

export default initGame;
