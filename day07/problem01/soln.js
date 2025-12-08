import fs from "fs";
import readline from "readline";
import process from "process";

const STARTING_POINT = "S";
const EMPTY_SPACE = ".";
const SPLITTER = "^";
const MARKED_SPLITTER = "*";
const LASER = "|";
const SPLIT_POINT = "x";

class Diagram {
  constructor() {
    this.board = [];
    this.splitCount = 0;
  }
  appendLine(line) {
    this.board.push(line.split(""));
  }
  processProblem() {
    this.board.forEach((line, rowIndex) => {
      if (rowIndex === 0) {
        // NO-OP
      } else
        line.forEach((character, columnIndex) => {
          // Don't touch anything non-empty
          if (this.board[rowIndex][columnIndex] !== EMPTY_SPACE) {
            // NO-OP
          }
          // Place laser based on overhead conditions
          else if (
            this.board[rowIndex - 1][columnIndex] === STARTING_POINT ||
            this.board[rowIndex - 1][columnIndex] === LASER ||
            this.board[rowIndex - 1][columnIndex] === SPLIT_POINT
          ) {
            this.board[rowIndex][columnIndex] = LASER;
          } else if (columnIndex !== 0 && this.board[rowIndex][columnIndex - 1] === SPLITTER) {
            this.board[rowIndex][columnIndex] = LASER;
          } else if (
            columnIndex != line.length &&
            this.board[rowIndex][columnIndex + 1] === SPLITTER
          ) {
            this.board[rowIndex][columnIndex] = LASER;
          }
        });
    });
  }
  getAnswer() {
    this.board.forEach((line, rowIndex) => {
      line.forEach((character, columnIndex) => {
        if (character === SPLITTER) {
          if (rowIndex >= 0 && this.board[rowIndex - 1][columnIndex] === LASER) {
            this.splitCount++;
            this.board[rowIndex][columnIndex] = MARKED_SPLITTER;
          }
          // if (columnIndex !== 0 && line[columnIndex - 1] === SPLIT_POINT) {
          //   this.board[rowIndex][columnIndex] = MARKED_SPLITTER;
          //   this.splitCount++;
          // } else if (columnIndex != line.length && line[columnIndex + 1] === SPLIT_POINT) {
          //   this.board[rowIndex][columnIndex] = MARKED_SPLITTER;
          //   this.splitCount++;
          // }
        }
      });
    });
    return this.splitCount;
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
  diagram.processProblem();
  console.log(diagram.getAnswer());
  console.table(diagram.board);
  console.log(diagram.splitCount);
}
solution(process.argv[2]);
