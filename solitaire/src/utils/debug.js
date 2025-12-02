// Debug logging that works everywhere in the app
// 
// How to use it:
// - From UI components: call setDebugLogger with your log function
// - From anywhere else: just call debugLog(message, data) and it'll show up
// 
// Has built-in duplicate detection so you don't see the same log twice

let debugLogCallback = null;
let __lastLogSig = null;
let __lastLogTime = 0;

const makeSig = (message, data) => {
    try {
        return `${message}|${data ? JSON.stringify(data) : ''}`;
    } catch {
        return message;
    }
};

/**
 * Hook up your logging function (usually done once when DebugMenu opens)
 * Gets cleared when the debug menu closes
 */
export function setDebugLogger(callback) {
    debugLogCallback = callback;
}

/**
 * Send a message to the debug console
 * Works from components, hooks, or anywhere else in the code
 */
export function debugLog(message, data) {
    const now = Date.now();
    const sig = makeSig(message, data);
    // Avoid dev-time duplicate logs from StrictMode by deduping in a short window
    if (__lastLogSig === sig && now - __lastLogTime < 200) return;
    __lastLogSig = sig;
    __lastLogTime = now;
    if (typeof debugLogCallback === 'function') debugLogCallback(message, data);
}

export default debugLog;
