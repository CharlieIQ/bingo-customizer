import React, { useState } from "react";
import * as htmlToImage from "html-to-image";
import "./styles.css";

const BingoCard = () => {
    // For grid size
    const [gridSize, setGridSize] = useState(5);
    // Grid creation
    const [grid, setGrid] = useState(
        Array(5).fill(null).map(() => Array(5).fill(""))
    );
    // Custom grid background color
    const [bgColor, setBgColor] = useState("#ffffff");

    /**
     * Function to change inputs in cells
     * @param {*} row Row of cell to update
     * @param {*} col Column of cell to update
     * @param {*} value New value to put in specified cell
     */
    const handleInputChange = (row, col, value) => {
        // Create an updated grid
        const updatedGrid = grid.map((currentRow, rowIndex) => {
            // If the current row is the one being updated
            if (rowIndex === row) {
                return currentRow.map((currentCell, colIndex) => {
                    // Change value of cell
                    return colIndex === col ? value : currentCell;
                });
            }
            return currentRow;
        });

        // Update the state with the new grid
        setGrid(updatedGrid);
    };

    /**
    * Shuffle the grid by randomly reordering the words in it
    */
    const handleShuffle = () => {
        // Flatten the grid
        const words = grid.flat().filter(word => word.trim() !== "");

        // Word checking
        if (words.length < gridSize * gridSize) {
            alert("Not enough words!");
            return;
        }

        // Make a grid and shuffle words in
        const shuffledWords = shuffleArray([...words]);
        let wordIndex = 0;
        const shuffledGrid = grid.map(row =>
            row.map(() => shuffledWords[wordIndex++] || "")
        );

        // Update the state
        setGrid(shuffledGrid);
    };

    /**
     * Helper function to shuffle an array randomly
     * @param {Array} array The array to shuffle
     * @returns {Array} A new array with the shuffled elements
     */
    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    /**
     * Function to handle downloading the bingo card image
     */
    const handleDownload = () => {
        const card = document.getElementById("bingo-card");
        htmlToImage.toPng(card).then((dataUrl) => {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "bingo-card.png";
            link.click();
        });
    };

    return (
        <div className="flex flex-col items-center p-6 min-h-screen bg-gray-100 text-gray-900">
            <h1 className="text-5xl font-bold mb-4">Bingo Card Maker</h1>
            <h3>Enter card size:</h3>
            <input
                type="number"
                min="3"
                max="7"
                value={gridSize}
                onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setGridSize(newSize);
                    setGrid(Array(newSize).fill(null).map(() => Array(newSize).fill("")));
                }}
                className="border p-2 m-2 rounded-lg shadow-sm"
            />
            <button onClick={handleShuffle} className="bg-blue-500 text-white p-2 m-2 rounded-lg shadow-md hover:bg-blue-600">
                Shuffle Words
            </button>
            <div
                id="bingo-card"
                className="grid border p-4 rounded-lg shadow-lg mt-4"
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                    backgroundColor: bgColor,
                    width: "min(135vw, 750px)",
                    height: "min(135vw, 750px)",
                    gap: "4px",
                }}
            >
                {grid.map((row, rowIndex) =>
                    row.map((word, colIndex) => (
                        <textarea
                            key={`${rowIndex}-${colIndex}`}
                            value={word}
                            onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                            style={{ backgroundColor: bgColor }}
                        />
                    ))
                )}
            </div>

            <button onClick={handleDownload} className="bg-green-500 text-white p-2 m-2 rounded-lg shadow-md hover:bg-green-600">
                Download board as PNG
            </button>
            <br /><h2>Choose a board color:</h2>
            <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="m-2"
            />
        </div>
    );
};

export default BingoCard;

// Good board background color: #5C4033
// Deployment: https://charlieiq.github.io/bingo-customizer