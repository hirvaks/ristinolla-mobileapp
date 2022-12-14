import { StatusBar } from 'expo-status-bar'
import { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, FlatList, Button, Modal } from 'react-native'
import checkWin from './components/CheckWin'
import ReactNativeZoomableView from '@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView'
import * as SQLite from 'expo-sqlite'
import ViewShot from 'react-native-view-shot'
import * as Sharing from "expo-sharing"
import { Audio } from 'expo-av'

const db = SQLite.openDatabase('xodb.db')

export default function App() {

  console.log('\n### App.js ###')

  const viewShot = useRef()

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
  const [whoseTurn, setWhoseTurn] = useState({ 'turn': 'X' })
  const [canZoom, seCanZoom] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)

  const [soundState, setSoundState] = useState()
  useEffect(() => {
    return soundState
      ? () => {
        console.log('Unloading Sound')
        soundState.unloadAsync()
      }
      : undefined;
  }, [soundState])

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists turns (id integer primary key not null, symbol text, x int, y int);')
    }, null, null)
  }, [])

  const saveTurn = (turn) => {
    db.transaction(tx => {
      tx.executeSql('insert into turns (symbol, x, y) values (?, ?, ?);', [turn.symbol, turn.x, turn.y])
    }, null, null)
  }

  const gameHistory = () => {
    db.transaction(tx => {
      tx.executeSql('select * from turns;', [], (_, { rows }) =>
        console.log(rows._array)
      )
    })
  }

  // Undo last turn
  const undo = () => {
    console.log('---undo---')
    db.transaction(tx => {
      tx.executeSql('select * from turns where id = (SELECT MAX(id) FROM turns);', [], (_, { rows }) => {
        if (rows._array.length > 0) {
          console.log(`Latest turn: ${rows._array[0].symbol}`)
          let previousTurn = ''
          if (rows._array[0].symbol === 'X') {
            previousTurn = 'O'
          } else {
            previousTurn = 'X'
          }
          console.log(`Previous turn: ${previousTurn}`)
          undoTurn(rows._array[0].x, rows._array[0].y, rows._array[0].symbol)
          deleteTurn()
        } else {
          console.log("Can't undo turn")
        }
      }
      )
    })
  }

  const deleteTurn = () => {
    db.transaction(tx => { tx.executeSql(`delete from turns where id = (SELECT MAX(id) FROM turns);`) })
  }

  const deleteHistory = () => {
    db.transaction(tx => { tx.executeSql(`delete from turns;`) }, null, resetBoard())
  }

  // Player pressed a square (X, Y) cordinates
  const boxPress = (row, col) => {
    console.log('---boxPress---')
    console.log(`Board cordinates = X:${row} Y:${col}`)

    if (board[row][col].xo === '') {
      playTurn(row, col, whoseTurn.turn)
    } else {
      console.log('Spot already taken')
    }
  }

  // Play the current turn (X, Y, symbol-X/O)
  const playTurn = (row, col, symbol) => {
    console.log('---playTurn---')

    let newBoard = board
    let currentMove = { 'symbol': symbol, 'x': row, 'y': col }

    newBoard[row][col].xo = symbol
    saveTurn(currentMove)
    setBoard(newBoard)


    if (checkWin(row, col, board, symbol)) {
      console.log(`${symbol} Won!`)
      playSound('W')
      setModalVisible(true)
      // console.log(gameLog)
    } else {
      if (symbol === 'X') {
        playSound('X')
        setWhoseTurn({ 'turn': 'O' })
      } else {
        playSound('O')
        setWhoseTurn({ 'turn': 'X' })
      }
    }
  }

  // Play sounds
  const playSound = async (type) => {
    console.log('---playSound---')
    console.log(`Sound type: ${type}`)
    if (type === 'X') {
      var { sound } = await Audio.Sound.createAsync(require('./assets/x-sound.mp3'))
    } else if (type === 'O') {
      var { sound } = await Audio.Sound.createAsync(require('./assets/o-sound.mp3'))
    } else if (type === 'W') {
      var { sound } = await Audio.Sound.createAsync(require('./assets/win.mp3'))
    }
    setSoundState(sound)
    await sound.playAsync()
  }

  // Undo previous turn
  const undoTurn = (row, col, previousTurn) => {
    console.log('---undoTurn---')
    console.log(`Previous turn to be played again: ${previousTurn}`)

    let newBoard = board
    newBoard[row][col].xo = ''

    setBoard(newBoard)
    setWhoseTurn({ 'turn': previousTurn })
  }

  // Reset board
  const resetBoard = () => {
    console.log(`\n---resetBoard---`)
    setBoard(emptyBoard)
    setWhoseTurn({ 'turn': 'X' })
  }

  // Capture a screenshot and share it
  const captureAndShare = () => {
    viewShot.current.capture().then((uri) => {
      console.log("do something with ", uri);
      Sharing.shareAsync(uri);
    }),
      (error) => console.error("Oops, snapshot failed", error);
  }

  // Maps columns in a row to playable squares
  const addRows = (item) => {
    return (
      <View style={styles.row} key={`Row${item.index}`}>
        {item.item.map(boardSquare, { rn: item.index })}
      </View>
    )
  }

  // map(function(currentValue, index, arr), thisValue)
  function boardSquare(val, i) {
    let rn = this.rn
    return (<Text style={styles.box} key={`Row${rn}-Col${i}`} onPress={() => boxPress(rn, i)}>{val.xo}</Text>)
  }

  return (
    <View style={styles.container}>
      <Text>{`Turn: ${whoseTurn.turn}`}</Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        margin: 10,
        width: 300
      }}>
        <Button title='Reset' onPress={deleteHistory} />
        <Button title='Undo' onPress={undo} />
      </View>
      <Modal
        transparent={true}
        animationType='slide'
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <Text
            style={{
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
              fontSize: 40
            }}
          >{`${whoseTurn.turn} Won!`}</Text>
          <Button title='Share a screenshot' onPress={captureAndShare} />
          <Button title='Close' onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <ReactNativeZoomableView
        zoomEnabled={canZoom}
        maxZoom={2}
        minZoom={1}
        zoomStep={1}
        initialZoom={1}
        bindToBorders={true}
      >
        <ViewShot
          ref={viewShot}
        >
          <View style={styles.board}>
            <FlatList
              data={board}
              renderItem={addRows} // Iterates rows (arrays in a array)
            />
          </View>
        </ViewShot>

      </ReactNativeZoomableView>
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
    height: 379,
    width: 379,
    borderWidth: 2,
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
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
});
