export default function checkWin(x, y, board, currentTurn) {

    console.log(`\n### checkWin ###`)
    console.log(`Symbol: ${currentTurn}\nCordinates = X:${x} Y:${y}`)

    // Check Y-axel(+/-)
    const yAxel = (x, y, turn) => {
        let count = 1

        for (let i = 1; i < 5; i++) {
            try {
                if (board[x + i][y].xo === turn) {
                    count++
                } else {
                    i = 5
                }
            } catch (error) {
                // console.log(`iteration ${i}/4 - no space below`)
            }
        }

        for (let i = 1; i < 5; i++) {
            try {
                if (board[x - i][y].xo === turn) {
                    count++
                } else {
                    i = 5
                }
            } catch (error) {
                // console.log(`iteration ${i}/4 - no space above`)
            }
        }

       // console.log(`Y-axel count: ${count}`)
        if (count >= 5) {
            return (true)
        } else return (false)
    }

    // Check X-axel(+/-)
    const xAxel = (x, y, turn) => {
        let count = 1

        for (let i = 1; i < 5; i++) {
            try {
                if (board[x][y + i].xo === turn) {
                    count++
                } else {
                    i = 5
                }
            } catch (error) {
                // console.log(`iteration ${i}/4 - no space on the right side`)
            }
        }

        for (let i = 1; i < 5; i++) {
            try {
                if (board[x][y - i].xo === turn) {
                    count++
                } else {
                    i = 5
                }
            } catch (error) {
                // console.log(`iteration ${i}/4 - no space on the left side`)
            }
        }

       // console.log(`X-axel count: ${count}`)
        if (count >= 5) {
            return (true)
        } else return (false)
    }

    // Check YX-axel(+/-)
    const yxAxel = (x, y, turn) => {
        let count = 1

        for (let i = 1; i < 5; i++) {
            try {
                if (board[x + i][y - i].xo === turn) {
                    count++
                } else {
                    i = 5
                }
            } catch (error) {
                // console.log(`iteration ${i}/4 - no space on the bottom left side`)
            }
        }

        for (let i = 1; i < 5; i++) {
            try {
                if (board[x - i][y + i].xo === turn) {
                    count++
                } else {
                    i = 5
                }
            } catch (error) {
                // console.log(`iteration ${i}/4 - no space on the top right side`)
            }
        }

        // console.log(`YX-axel count: ${count}`)
        if (count >= 5) {
            return (true)
        } else return (false)
    }

    // Check XY-axel(+/-)
    const xyAxel = (x, y, turn) => {
        let count = 1

        for (let i = 1; i < 5; i++) {
            try {
                if (board[x + i][y + i].xo === turn) {
                    count++
                } else {
                    i = 5
                }
            } catch (error) {
                // console.log(`iteration ${i}/4 - no space on the bottom right side`)
            }
        }

        for (let i = 1; i < 5; i++) {
            try {
                if (board[x - i][y - i].xo === turn) {
                    count++
                } else {
                    i = 5
                }
            } catch (error) {
                // console.log(`iteration ${i}/4 - no space on the top left side`)
            }
        }

        // console.log(`XY-axel count: ${count}`)
        if (count >= 5) {
            return (true)
        } else return (false)
    }

    if (yAxel(x, y, currentTurn) === true) {
        console.log('Victory (Y-axel)')
        return true
    } else if (xAxel(x, y, currentTurn) === true) {
        console.log('Victory (X-axel)')
        return true
    } else if (yxAxel(x, y, currentTurn) === true) {
        console.log('Victory (YX-axel)')
        return true
    } else if (xyAxel(x, y, currentTurn) === true) {
        console.log('Victory (XY-axel)')
        return true
    } else {
        console.log('No win')
        return false
    }
}