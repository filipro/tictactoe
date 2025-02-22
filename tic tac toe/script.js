document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const statusText = document.getElementById("status");
    const difficultySelect = document.getElementById("difficulty");
    let boardState = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;

    function createBoard() {
        board.innerHTML = "";
        boardState.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.index = index;
            cellElement.textContent = cell;
            cellElement.addEventListener("click", handleMove);
            board.appendChild(cellElement);
        });
    }

    function handleMove(event) {
        const index = event.target.dataset.index;
        if (boardState[index] === "" && gameActive) {
            boardState[index] = currentPlayer;
            updateBoard();
            if (checkWinner()) return;
            currentPlayer = "O";
            setTimeout(botMove, 500);
        }
    }

    function botMove() {
        if (!gameActive) return;

        const difficulty = difficultySelect.value;
        let bestMove;

        if (difficulty === "easy") {
            bestMove = getEasyMove();
        } else if (difficulty === "medium") {
            bestMove = Math.random() < 0.5 ? getEasyMove() : minimax(boardState, "O").index;
        } else {
            bestMove = minimax(boardState, "O").index;
        }

        boardState[bestMove] = "O";
        updateBoard();
        checkWinner();
        currentPlayer = "X";
    }

    function getEasyMove() {
        let emptyCells = boardState.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);

        
        for (let i of emptyCells) {
            boardState[i] = "O";
            if (checkWin(boardState, "O")) {
                boardState[i] = "";
                return i;
            }
            boardState[i] = "";
        }

        
        for (let i of emptyCells) {
            boardState[i] = "X";
            if (checkWin(boardState, "X")) {
                boardState[i] = "";
                return i;
            }
            boardState[i] = "";
        }

        
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function updateBoard() {
        document.querySelectorAll(".cell").forEach((cell, index) => {
            cell.textContent = boardState[index];
            cell.classList.toggle("taken", boardState[index] !== "");
        });
    }

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                gameActive = false;
                statusText.textContent = `${boardState[a]} wins!`;
                return true;
            }
        }
        if (!boardState.includes("")) {
            gameActive = false;
            statusText.textContent = "It's a draw!";
            return true;
        }
        return false;
    }

    function resetGame() {
        boardState = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        currentPlayer = "X";
        statusText.textContent = "Your turn!";
        createBoard();
    }

    document.querySelector("button").addEventListener("click", resetGame);
    createBoard();

  
    function minimax(newBoard, player) {
        const emptyCells = newBoard.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);
        
        if (checkWin(newBoard, "X")) return { score: -10 };
        if (checkWin(newBoard, "O")) return { score: 10 };
        if (emptyCells.length === 0) return { score: 0 };

        let moves = [];
        for (let i of emptyCells) {
            let move = {};
            move.index = i;
            newBoard[i] = player;

            if (player === "O") {
                let result = minimax(newBoard, "X");
                move.score = result.score;
            } else {
                let result = minimax(newBoard, "O");
                move.score = result.score;
            }

            newBoard[i] = "";
            moves.push(move);
        }

        let bestMove;
        if (player === "O") {
            let highestScore = -Infinity;
            for (let move of moves) {
                if (move.score > highestScore) {
                    highestScore = move.score;
                    bestMove = move;
                }
            }
        } else {
            let lowestScore = Infinity;
            for (let move of moves) {
                if (move.score < lowestScore) {
                    lowestScore = move.score;
                    bestMove = move;
                }
            }
        }
        return bestMove;
    }

    function checkWin(board, player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern => pattern.every(index => board[index] === player));
    }
});
