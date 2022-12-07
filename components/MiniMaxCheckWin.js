// TODO:
// Optimize by checking loose ends (empty cells in the ends)

export default function miniMaxCheckWin(board, currentTurn) {

    console.log(`\n### miniMaxCheckWin ###`)

    let turn = currentTurn.symbol
    let x = currentTurn.x
    let y = currentTurn.y

    console.log(`Symbol: ${turn}\nCordinates = X:${x} Y:${y}`)

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
        return ({ 'axel': 'Y-axel', 'count': count })
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
        return ({ 'axel': 'X-axel', 'count': count })
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
        return ({ 'axel': 'YX-axel', 'count': count })
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
        return ({ 'axel': 'XY-axel', 'count': count })
    }

    const evaluate = () => {
        points = Math.max(
            xAxel(x, y, turn).count,
            yAxel(x, y, turn).count,
            xyAxel(x, y, turn).count,
            yxAxel(x, y, turn).count
        )
        if (turn === 'X') {
            console.log(`X points: ${points * -1}`)
            return (points * -1)
        } else {
            console.log(`O points: ${points}`)
            return (points)
        }
    }

    return (evaluate())
}