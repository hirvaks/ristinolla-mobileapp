import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import AI from './components/AI';
import checkWin from './components/CheckWin';

/* TODO
- Victory scene screencapture
- Sound effects
- Undo
- Save game in SQLite
- Zoomable board
- AI
- Time limit?
- Separate component for board?
*/

export default function App() {

  console.log('\n### App.js ###')

  // 15 x 15 board
  const emptyBoard = [
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }],
    [{ xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }, { xo: '' }]
  ]

  const [board, setBoard] = useState(emptyBoard)

  const [moveCount, setMoveCount] = useState(0) // max 225

  const [gameLog, setGameLog] = useState([])

  const [whoseTurn, setWhoseTurn] = useState('X')

  const [waitForAI, setWaitForAI] = useState(false)

  // Player pressed a square (X, Y) cordinates
  const boxPress = (row, col) => {
    console.log('---boxPress---')
    console.log(`Board cordinates = X:${row} Y:${col}`)
    if (waitForAI) {
      console.log('Not your turn, wait for AI!')
    } else {
      if (board[row][col].xo === '') {
        playTurn(row, col, 'X')
      } else {
        console.log('Spot already taken')
      }
    }
  }

  // Play the current turn (X, Y, symbol-X/O)
  const playTurn = (row, col, symbol) => {
    console.log('---playTurn---')
    setMoveCount(moveCount + 1)

    if (symbol === 'O') {
      setWaitForAI(false)
    }

    let newBoard = board
    newBoard[row][col].xo = symbol
    setBoard(newBoard)

    let currentMove = { 'symbol': symbol, 'x': row, 'y': col }
    setGameLog(gameLog => [currentMove, ...gameLog]) // -> separate function to save history in SQLite

    if (checkWin(row, col, board, symbol)) {
      console.log(`${symbol} Won!`)
      // console.log(gameLog)
    } else {
      if (symbol === 'X') {
        setWhoseTurn('O')
        setWaitForAI(true)
        playBot(newBoard, currentMove)
      } else {
        setWhoseTurn('X')
      }
    }
  }

  // AI takes a turn
  const playBot = (currentBoard, lastMove) => {
    console.log('---playBot---')

    let botCordinates = AI(currentBoard, lastMove)
    console.log(`AI cordinates = X:${botCordinates.row} Y:${botCordinates.col}`)
    console.log(`Previous turn = X:${lastMove.x} Y:${lastMove.y}`)
    if (botCordinates.row === -1) {
      console.log('Bot could not define the next move')
    } else {
      playTurn(botCordinates.row, botCordinates.col, 'O')
    }
  }

  // Reset board
  const resetBoard = () => {
    console.log(`\n---resetBoard---`)
    setBoard(emptyBoard)
    setGameLog([])
    setWhoseTurn('X')
  }

  // Maps columns in a row to playable squares
  const addCols = (item) => {
    return (
      <View style={styles.row} key={`Row${item.index}`}>
        {item.item.map(boardSquare, { rn: item.index })}
      </View>
    )
  }

  // map(function(currentValue, index, arr), thisValue)
  function boardSquare(val, i) {
    let rn = this.rn
    return (<Text style={styles.box} key={`Row${rn}-Col${i}`} onPress={() => boxPress(this.rn, i)}>{val.xo}</Text>)
  }

  return (
    <View style={styles.container}>
      <Text>{`${whoseTurn} turn`}</Text>
      <Button title='Reset board' onPress={resetBoard} />
      <View style={styles.board}>
        <FlatList
          data={board}
          renderItem={addCols} // Iterates rows (arrays in a array)
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  board: {
    marginTop: 10,
    // height: 380,
    // width: 380,
    // borderWidth: 2,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  box: {
    textAlign: 'center',
    //alignItems: 'center',
    //justifyContent: 'center',
    fontSize: 18,
    borderWidth: 0.5,
    height: 25,
    width: 25,
  },
});
