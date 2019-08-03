import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return <button className="square" onClick={props.onClick}>{props.value}</button>
}

class Board extends React.Component {
  constructor(props){
    super(props);
    this.size = 3
  }

  renderSquare(i) {
    return <Square key={i} value={this.props.squares[i]} onClick={()=> this.props.onClick(i)}/>;
  }

  render() {
    return (
      <div>
        {
          square_array(this.size).map((rows) => {
            return (
              <div key={rows} className="board-row">
                {rows.map((value) => {
                  return this.renderSquare(value);
                })}
              </div>
            )
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{squares: Array(9).fill(null)}],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        position: map_position(i)
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      isActive: null
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      isActive: step,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move}(col: ${step.position['col']}, row: ${step.position['row']})` :
        'Go to game start';

      let className = '';
      if (this.state.isActive === move) {
        className += ' bold';
      }
      return (
        <li key={move}>
          <button className={className} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function map_position(i) {
  return {col: i % 3, row: Math.floor(i / 3)};
}

// [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
function square_array(size) {
  const range = Array.from(Array(size ** 2).keys());
  let square_array = [];
  for (let i = 0; i < size; i++) {
    const pointer = i * size;
    square_array.push(range.slice(pointer, pointer + size));
  }
  return square_array;
}
