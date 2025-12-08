import fs from "fs";
import readline from "readline";
import process from "process";

const STARTING_POINT = "S";
const EMPTY_SPACE = ".";
const SPLITTER = "^";
const MARKED_SPLITTER = "*";

class Diagram {
  constructor() {
    this.board = [];
    this.markedBoard = [];
    this.splitCount = 0;
  }
  appendLine(line) {
    this.board.push(line.split(""));
    this.markedBoard.push(line.split(""));
  }

  processProblem() {
    const startingIndex = this.board[0].indexOf(STARTING_POINT);
    const result = this.forkUniverse(1, startingIndex);
    return result;
  }
  forkUniverse(rowIndex, columnIndex) {
    // Hit the end. Nice!
    if (rowIndex >= this.board.length) {
      return 1;
    }
    // Boundary conditions
    else if (columnIndex === -1 || columnIndex === this.board[0].length) {
      return 0;
    }

    const character = this.board[rowIndex][columnIndex];

    // If branch is solved, return that
    if (!isNaN(parseFloat(character))) {
      return Number(character);
    }

    // Line down
    if (character === EMPTY_SPACE) {
      const currentScore = this.forkUniverse(rowIndex + 1, columnIndex);
      // If we're moving back up, mark the sub-problem for re-use in future junctions.
      this.board[rowIndex][columnIndex] = currentScore;
      this.markedBoard[rowIndex][columnIndex] = currentScore;
      return currentScore;
    }
    // Fork horizontally
    else if (character === SPLITTER) {
      this.markedBoard[rowIndex][columnIndex] = MARKED_SPLITTER;
      this.splitCount++;
      return (
        this.forkUniverse(rowIndex, columnIndex - 1) + this.forkUniverse(rowIndex, columnIndex + 1)
      );
    }
  }
}

// Boilerplate
async function solution(path) {
  const fileStream = fs.createReadStream(path, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: fileStream,
  });

  const diagram = new Diagram();
  for await (const line of rl) {
    diagram.appendLine(line);
  }
  const answer = diagram.processProblem();
  console.table(diagram.markedBoard);
  console.log(answer);
}
solution(process.argv[2]);
