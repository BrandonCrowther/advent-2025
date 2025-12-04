import fs from "fs";
import readline from "readline";
import process from "process";

const PAPER = "@";
const EMPTY = ".";
const MARKED = "x";
const maxAdjacent = 3;

class Solution {
  constructor() {
    this.map = [];
    this.iterationAnswer = 0;
  }

  inspect(candidateY, candidateX) {
    let adjacentCount = 0;
    if (this.map[candidateY][candidateX] === EMPTY) {
      return;
    }
    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        if (x === 0 && y === 0) {
          // No-op
        } else if (this.map[candidateY + y][candidateX + x] !== EMPTY) {
          adjacentCount++;
        }
      }
    }
    if (adjacentCount <= maxAdjacent) {
      this.map[candidateY][candidateX] = EMPTY;
      this.iterationAnswer++;
    }
    // this.map[candidateY][candidateX] = adjacentCount;
  }
}

// Boilerplate
async function solution(path) {
  const fileStream = fs.createReadStream(path, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: fileStream,
  });

  const solution = new Solution();
  for await (const line of rl) {
    let lineAsArray = line.split("");
    // Add extra padding so I dont have to check boundaries
    lineAsArray = [EMPTY, ...lineAsArray];
    lineAsArray.push(EMPTY);

    solution.map.push(lineAsArray);
  }
  console.table(solution.map);
  const boundaryLine = solution.map[0].map(() => EMPTY);

  // Add extra lines at top and bottom so I dont have to check boundaries
  solution.map = [boundaryLine, ...solution.map];
  solution.map.push(boundaryLine);

  let finalAnswer = 0;
  console.table(solution.map);
  do {
    solution.iterationAnswer = 0;
    for (let candidateY = 1; candidateY < solution.map.length - 1; candidateY++) {
      for (let candidateX = 1; candidateX < solution.map[0].length - 1; candidateX++) {
        solution.inspect(candidateY, candidateX);
      }
    }
    console.table(solution.map);
    console.log("iter: ", solution.iterationAnswer);
    finalAnswer += solution.iterationAnswer;
  } while (solution.iterationAnswer !== 0);
  console.log("Final answer: ", finalAnswer);
}
solution(process.argv[2]);
