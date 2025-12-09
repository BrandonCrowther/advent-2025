import fs from "fs";
import readline from "readline";
import process from "process";

const UNINITIALIZED = "U";

class RedTile {
  constructor(id, x, y) {
    this.id = id;
    this.x = Number(x);
    this.y = Number(y);
  }

  getDistance(otherTile) {
    // TODO remove floor
    return Math.floor(
      Math.sqrt(Math.pow(this.x - otherTile.x, 2) + Math.pow(this.y - otherTile.y, 2)),
    );
  }

  getRectangleSize(otherTile) {
    const width = Math.abs(this.x - otherTile.x) + 1;
    const height = Math.abs(this.y - otherTile.y) + 1;
    return width * height;
  }

  toString() {
    return `${this.x}-${this.y}`;
  }
}

class Board {
  constructor(tileList) {
    this.tileList = tileList;
    this.distanceMatrix = tileList.map(() => tileList.map(() => UNINITIALIZED));
    this.maxDistance = -1;
    this.distanceMatrix.forEach((col, colIndex) => {
      col.forEach((_, rowIndex) => {
        const computedDistance = this.tileList[colIndex].getRectangleSize(this.tileList[rowIndex]);
        if (this.maxDistance === -1 || computedDistance > this.maxDistance) {
          this.maxDistance = computedDistance;
        }
        console.log(this.tileList[colIndex], this.tileList[rowIndex], computedDistance);
        this.distanceMatrix[colIndex][rowIndex] = computedDistance;
      });
    });
  }
}

// Boilerplate
async function solution(path) {
  const fileStream = fs.createReadStream(path, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: fileStream,
  });

  let lineIndex = 0;
  let tileList = [];
  for await (const line of rl) {
    const split = line.split(",");
    const tile = new RedTile(lineIndex, split[0], split[1]);
    tileList.push(tile);
    lineIndex++;
  }

  const board = new Board(tileList);

  console.table(board.tileList);
  console.table(board.distanceMatrix);
  console.table(board.maxDistance);
}
solution(process.argv[2]);
