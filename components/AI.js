import miniMaxCheckWin from "./MiniMaxCheckWin"

// Player = 'X'
// Bot = 'O'

// Prevent checking outside the 'playing area' to optimize performance
// -> Keep track of the smallest and biggest XY-coordinates
// --> Start the iteration from smallest coordinates -1
// ---> End the iteration in the biggest cordinates +1

export default function AI(currentBoard, lastPlayerMove) {

    console.log(`\n### AI.js ###`)

    const maxDepth = 1

    const spaceLeft = (board) => {
        // console.log('---spaceLeft---')
        let spotsLeft = 225

        for (let r = 0; r < 15; r++) {
            for (let c = 0; c < 15; c++) {
                if (board[r][c].xo === 'X' || board[r][c].xo === 'O') {
                    // console.log(`${board[r][c].xo} = X:${r} Y:${c}`)
                    spotsLeft--
                }
            }
        }
        // console.log(`Spots left = ${spotsLeft}`)
        return (spotsLeft)
    }

    // Limit the options for minimax iterations
    // Alternative for playArea(board)
    const areaAroundLastMove = (lastMove) => {
        console.log('---areaAroundLastMove---')
        let gameArea = { 'min': { 'x': 15, 'y': 15 }, 'max': { 'x': -1, 'y': -1 } }

        let lastMoveX = lastMove.x
        let lastMoveY = lastMove.y
        let plusMinus = 1

        gameArea.min.x = lastMoveX - plusMinus
        gameArea.min.y = lastMoveY - plusMinus
        if (gameArea.min.x < 0) gameArea.min.x = 0
        if (gameArea.min.y < 0) gameArea.min.y = 0

        gameArea.max.x = lastMoveX + plusMinus
        gameArea.max.y = lastMoveY + plusMinus
        if (gameArea.max.x > 14) gameArea.max.x = 14
        if (gameArea.max.y > 14) gameArea.max.y = 14

        console.log(`Smallest playable cordinates = X:${gameArea.min.x} Y:${gameArea.min.y}`)
        console.log(`Biggest playable cordinates = X:${gameArea.max.x} Y:${gameArea.max.y}`)
        return (gameArea)
    }

    // Limit the options for minimax iterations
    // Alternative for areaAroundLastMove(lastMove)
    const playArea = (board) => {
        console.log('---playArea---')

        let gameArea = { 'min': { 'x': 15, 'y': 15 }, 'max': { 'x': -1, 'y': -1 } }

        // Define the smallest and biggest cordinates for a playable cell
        // (XY-coordinates of a symbol closest to 0-0 / 14-14) +/-1 if within grid
        for (let r = 0; r < 15; r++) {
            for (let c = 0; c < 15; c++) {
                if (board[r][c].xo === 'X' || board[r][c].xo === 'O') {

                    // Set the minimum values
                    if (r < gameArea.min.x) {
                        if (r > 0) {
                            gameArea.min.x = r - 1
                        } else {
                            gameArea.min.x = r
                        }
                    }
                    if (c < gameArea.min.y) {
                        if (c > 0) {
                            gameArea.min.y = c - 1
                        } else {
                            gameArea.min.y = c
                        }
                    }

                    // Set the maximum values
                    if (r > gameArea.max.x) {
                        if (r < 14) {
                            gameArea.max.x = r + 1
                        } else {
                            gameArea.max.x = r
                        }
                    }
                    if (c > gameArea.max.y) {
                        if (c < 14) {
                            gameArea.max.y = c + 1
                        } else {
                            gameArea.max.y = c
                        }
                    }
                }
            }
        }
        console.log(`Smallest playable cordinates = X:${gameArea.min.x} Y:${gameArea.min.y}`)
        console.log(`Biggest playable cordinates = X:${gameArea.max.x} Y:${gameArea.max.y}`)
        return (gameArea)
    }

    //------------------------------MINIMAX------------------------------
    // AI = isMax
    // Player = !isMax
    const minimax = (board, depth, isMax, turn, gameArea, alpha, beta) => {
        console.log(`minimax iteration: ${depth}\nisMax: ${isMax}`)
        // console.log(`Coordinates = X: ${turn.x} Y: ${turn.y}`)

        // Valuate move
        let score = miniMaxCheckWin(board, turn)

        // Return score if Maximizer has won the game
        if (score >= 5)
            return score

        // Return score if Minimizer has won the game
        if (score <= -5)
            return score

        // Tie
        if (spaceLeft(board) === 0)
            return 0

        // If this maximizer's move
        if (isMax) {
            let maxBest = -1000

            // Iterate thru the given area
            for (let r = gameArea.min.x; r <= gameArea.max.x; r++) {
                for (let c = gameArea.min.y; c <= gameArea.max.y; c++) {

                    // Check if cell is empty
                    if (board[r][c].xo === '') {

                        let maxMove = { 'symbol': 'O', 'x': r, 'y': c }

                        // Make the move
                        board[r][c].xo = 'O'

                        // Call minimax recursively and choose the maximum value
                        maxValue = minimax(board, depth + 1, false, maxMove, areaAroundLastMove(maxMove), alpha, beta)

                        // Undo the move
                        board[r][c].xo = ''

                        maxBest = Math.max(maxValue, maxBest)

                        alpha = Math.max(alpha, maxValue)

                        if (beta <= alpha) {
                            return (maxBest)
                        }

                        if (depth + 1 >= maxDepth) {
                            return (maxBest)
                        }
                    }
                }
            }
        }

        // If this minimizer's move
        else {
            let minBest = 1000

            // Iterate thru the given area
            for (let r = gameArea.min.x; r <= gameArea.max.x; r++) {
                for (let c = gameArea.min.y; c <= gameArea.max.y; c++) {

                    // Check if cell is empty
                    if (board[r][c].xo === '') {

                        let minMove = { 'symbol': 'X', 'x': r, 'y': c }

                        // Make the move
                        board[r][c].xo = 'X'

                        // Call minimax recursively and choose the minimum value
                        minValue = minimax(board, depth + 1, true, minMove, areaAroundLastMove(minMove), alpha, beta)

                        // Undo the move
                        board[r][c].xo = ''

                        minBest = Math.min(minValue, minBest)

                        beta = Math.min(beta, minValue)

                        if (beta <= alpha) {
                            return (minBest)
                        }

                        if (depth + 1 >= maxDepth) {
                            return (minBest)
                        }
                    }
                }
            }
        }
    }

    //------------------------------FIND BEST MOVE------------------------------
    // Return best move
    const findBestMove = (board, lastPlayerMove) => {
        console.log('---findBestMove---')
        // console.log(`Spots left = ${spaceLeft(board)}`)

        let gameArea = areaAroundLastMove(lastPlayerMove)
        // let gameArea = playArea(board)
        // console.log(gameArea)

        let bestVal = -1000
        let bestMove = { 'row': -1, 'col': -1 }

        // Iterate thru the given area with miniMax and return bestMove
        for (let r = gameArea.min.x; r <= gameArea.max.x; r++) {
            for (let c = gameArea.min.y; c <= gameArea.max.y; c++) {

                // Check if cell is empty
                if (board[r][c].xo === '') {

                    let move = { 'symbol': 'O', 'x': r, 'y': c }

                    // Make the move
                    board[r][c].xo = 'O'

                    // Get the value for this move
                    //let moveVal = minimax(board, 0, false, { 'x': r, 'y': c }, playArea(board))
                    let moveVal = minimax(board, 0, false, { 'x': r, 'y': c }, areaAroundLastMove(move), -1000, 1000)

                    // Undo the move
                    board[r][c].xo = ''

                    // Update best move/value if the current move is better
                    if (moveVal > bestVal) {
                        bestMove.row = r
                        bestMove.col = c
                        bestVal = moveVal
                    }
                }
            }
        }
        return bestMove;
    }

    return (
        findBestMove(currentBoard, lastPlayerMove)
    )
}