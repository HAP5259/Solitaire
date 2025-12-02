/**
 * The very first file that runs when you load the app
 * 
 * What happens here:
 * - Grabs the root div from index.html
 * - Wraps everything in the drag-and-drop provider
 * - Kicks off React and shows the game
 * 
 * The DndProvider here makes dragging cards work throughout the whole app
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; 

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <DndProvider backend={HTML5Backend}>
            <App />
        </DndProvider>
    </React.StrictMode>
)