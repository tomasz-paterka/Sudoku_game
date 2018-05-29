import React, {Component} from 'react';
import sudoku from 'sudoku-umd';
import Board from '../components/Board.js';
import Buttons from '../components/Buttons.js';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initialBoard: localStorage.getItem('initialboard') ? localStorage.getItem('initialboard') : '',
			board: localStorage.getItem('board') ? localStorage.getItem('board') : '',
			error: '',
			newGameClicked: false,
			movesArray: localStorage.getItem('moves') ? JSON.parse(localStorage.getItem('moves')) : []
		}
	}
	
	startNewGame(level) {
		const newGame = sudoku.generate(level);
		this.setState({
			board: newGame,
			initialBoard: newGame,
			error: '',
			newGameClicked: false
		});
		this.localStorageClearHandler();
	}
	
	newGameHandler() {
		this.setState({
			board : '',
			initialBoard: '',
			error: '',
			newGameClicked: true
		})
	}
	
	restartNewGame() {
		this.setState({
			board : this.state.initialBoard,
			error : ''
		});
	}
	
	solveSudoku() {
		if (sudoku.solve(this.state.board)) {
			this.setState({
				board : sudoku.solve(this.state.board),
				error : ''
			});
		} else {
			this.setState({error: "Sorry, something is wrong."});
		}
	}
	
	checkSudoku() {
		if (this.state.board !== this.state.initialBoard) {
			if (this.state.board === sudoku.solve(this.state.board)) {
				this.setState({error: "Great! You won!"});
			} else if (sudoku.solve(this.state.board)) {
				this.setState({error: "So far so good!"});
			} else {
				this.setState({error: "Sorry, something is wrong."});
			}
		}   
	}
	
	onChangeHandler(value, id) {
		var array = this.state.board.split('').map((tile, index) =>
				(index === parseInt(id, 0)) ? ((value !== "") && (value < 10) && (value > 0) ? value : ".") : tile)
			.join('');
		this.setState({
			board: array,
			error: ""
		});
		this.setMovesArray(id, value, array);
	}
	
	setMovesArray(id, value, array) {
		var allMoves = this.state.movesArray.concat([{id, value}]);
		this.setState({movesArray : allMoves});
		this.localStorageHandler(array, allMoves);
	}
	
	undoHandler() {
		var movesArrayLength = this.state.movesArray.length;
		if (movesArrayLength) {
			var removedTileId = this.state.movesArray[movesArrayLength-1].id;
			var newMovesArray = this.state.movesArray.slice(0, movesArrayLength-1);
			var prevTileValueArray = newMovesArray.filter(move => move.id === removedTileId);

			var prevTileValue = (prevTileValueArray.length > 0 && prevTileValueArray[prevTileValueArray.length-1].value !== "") ? 
				prevTileValueArray[prevTileValueArray.length-1].value : ".";

			var newBoard = this.state.board.split('').map((tile, index) => (index === parseInt(removedTileId,0)) ? prevTileValue : tile).join('');
			this.setState({
				board : newBoard,
				movesArray: newMovesArray
			});
			this.localStorageHandler(newBoard, newMovesArray);
		}
	}
	
	localStorageHandler(currentGameState, allMoves) {
		localStorage.setItem('board', currentGameState);
		localStorage.setItem('initialboard', this.state.initialBoard);
		localStorage.setItem('moves', JSON.stringify(allMoves));
	}

	localStorageClearHandler() {
		localStorage.clear('initialboard');
		localStorage.clear('board');
		localStorage.clear('moves');
	}
	
	render() {
		return (
			<div className="App">
				<h1>Sudoku App</h1>
				<Buttons
					newGameHandler={() => this.newGameHandler()}
					startNewGame={(level) => this.startNewGame(level)}
					restartNewGame={() => this.restartNewGame()}
					checkSudoku={() => this.checkSudoku()}
					solveSudoku={() => this.solveSudoku()}
					error={this.state.error}
					newGameClicked={this.state.newGameClicked}
					/>
				<Board 
					board={this.state.board.split('')} 
					initialBoard={this.state.initialBoard.split('')} 
					onChange={(value, id) => this.onChangeHandler(value, id)}
					/>
				{
					this.state.board ? <button onClick={() => this.undoHandler()} className="undo-button">UNDO</button> : null
				}
			</div>
		);
	}
}

export default App;