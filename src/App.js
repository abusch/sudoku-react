import './App.css';
import React from 'react';

class Cell extends React.Component {

  render() {
    let value = (this.props.value.value === 0)?" ":(this.props.value.value);
    console.log("rendering cell...");
    return <div className={"cell " + this.props.selection}>
      {value}
    </div>;
  }
}

class Board extends React.Component {
  renderBlock(blockX, blockY) {
    var cells = Array(9);
    var data = this.props.cellData;

    for(var j = 0; j < 3; j++) {
      let y = blockY * 3 + j;
      for(var i = 0; i < 3; i++) {
        let x = blockX * 3 + i;
        var selection;
        if (x === this.props.selectedColumn && y === this.props.selectedRow) {
          selection = "selectedCell";
        } else if (x === this.props.selectedColumn) {
          selection = "selectedColumn";
        } else if (y === this.props.selectedRow) {
          selection = "selectedRow";
        } else {
          selection = "";
        }
        cells.push(<Cell key={x + "," + y + "," + selection} value={data[y*9+x]} selection={selection} />);
      }
    }
    return <div className="block">
    {cells}
    </div>
  }

  render() {
    console.log("Rendering board...");
    return <div className="board">
      {this.renderBlock(0,0)}
      {this.renderBlock(1,0)}
      {this.renderBlock(2,0)}
      {this.renderBlock(0,1)}
      {this.renderBlock(1,1)}
      {this.renderBlock(2,1)}
      {this.renderBlock(0,2)}
      {this.renderBlock(1,2)}
      {this.renderBlock(2,2)}
    </div>;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    let data = [
      0, 0, 1, 2, 0, 3, 4, 0, 0,
      0, 0, 0, 6, 0, 7, 0, 0, 0,
      5, 0, 0, 0, 0, 0, 0, 0, 3,
      3, 7, 0, 0, 0, 0, 0, 8, 1,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      6, 2, 0, 0, 0, 0, 0, 3, 7,
      1, 0, 0, 0, 0, 0, 0, 0, 8,
      0, 0, 0, 8, 0, 5, 0, 0, 0,
      0, 0, 6, 4, 0, 2, 5, 0, 0];
    this.state = {
      data: data.map(v => {
        return {value : v, locked: (v !== 0)};
      }),
      selectedRow: 1,
      selectedColumn: 1
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    var x = this.state.selectedColumn;
    var y = this.state.selectedRow;
    console.log("In handleKeyDown: event = " + event.key);
    console.log("state = " + this.state);
    console.log("current selected: " + x + ", " + y);

    if (event.key === 'j' || event.key === 'ArrowDown') {
      if (y === 8) {
        y = 0;
      } else {
        y = y + 1;
      }
    } else if (event.key === 'k' || event.key === 'ArrowUp') {
      if (y === 0) {
        y = 8;
      } else {
        y = y - 1;
      }
    } else if (event.key === 'h' || event.key === 'ArrowLeft') {
      if (x === 0) {
        x = 8;
      } else {
        x = x - 1;
      }
    } else if (event.key === 'l' || event.key === 'ArrowRight') {
      if (x === 8) {
        x = 0;
      } else {
        x = x + 1;
      }
    }
    this.setState({selectedColumn: x, selectedRow: y});

    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (digits.includes(event.key)) {
      this.setState((prevState) => {
        var data = prevState.data.slice();
        var currentCell = data[y * 9 + x];
        if (!currentCell.locked) {
          currentCell.value = parseInt(event.key);
        }
        return { data: data };
      })

    }
    console.log("After update selected: " + x + ", " + y);
  };

  componentDidMount() {
    console.log("Adding keyboard listener");
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    console.log("Removing keyboard listener");
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    return (
      <div className="content" onKeyDown={this.handleKeyDown}>
        <h1>SUDOKU</h1>
        <Board
          cellData={this.state.data}
          selectedRow={this.state.selectedRow}
          selectedColumn={this.state.selectedColumn} />
        <footer>&copy; Copyright 2021, Antoine Busch</footer>
      </div>
    );
  }
}

export default App;
