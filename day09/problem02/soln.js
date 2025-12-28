import fs from "fs";
import readline from "readline";
import process from "process";

const UNINITIALIZED = "U";
const VALID_TILE = "X";
const MARKER_TILE = "O";

class Node {
  constructor(id, x, y) {
    // this.id = id;
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
    return `{${this.x}-${this.y}}`;
  }

  isBetweenX(otherLine) {
    return (
      (this.x >= otherLine.node1.x && this.x <= otherLine.node2.x) ||
      (this.x <= otherLine.node1.x && this.x >= otherLine.node2.x)
    );
  }

  isBetweenY(otherLine) {
    return (
      (this.y >= otherLine.node1.y && this.y <= otherLine.node2.y) ||
      (this.y <= otherLine.node1.y && this.y >= otherLine.node2.y)
    );
  }

  isIdentical(otherNode) {
    return this.x === otherNode.x && this.y === otherNode.y;
  }
}

class Line {
  constructor(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
    if (node2.x !== node1.x && node2.y !== node1.y) {
      throw new Error(`${node1.toString()} is not compatible with ${node2.toString()}`);
    }
  }

  isVertical() {
    return this.node1.x === this.node2.x;
  }

  isHorizontal() {
    return !this.isVertical();
  }

  isIntersecting(otherLine) {
    if (this.hasNode(otherLine.node1) || this.hasNode(otherLine.node2)) {
      return false;
    }
    if (this.isVertical() && otherLine.isHorizontal()) {
      // For vertical line to intersect horizontal line:
      // 1. Vertical's X must be between horizontal's X range
      // 2. Horizontal's Y must be between vertical's Y range
      return (
        (this.node1.isBetweenX(otherLine) || this.node2.isBetweenX(otherLine)) &&
        (otherLine.node1.isBetweenY(this) || otherLine.node2.isBetweenY(this))
      );
    }

    if (this.isHorizontal() && otherLine.isVertical()) {
      // For horizontal line to intersect vertical line:
      // 1. Horizontal's Y must be between vertical's Y range
      // 2. Vertical's X must be between horizontal's X range
      return (
        (this.node1.isBetweenY(otherLine) || this.node2.isBetweenY(otherLine)) &&
        (otherLine.node1.isBetweenX(this) || otherLine.node2.isBetweenX(this))
      );
    }
    return false;
  }

  hasNode(otherNode) {
    return this.node1.isIdentical(otherNode) || this.node2.isIdentical(otherNode);
  }

  toString() {
    return this.node1.toString() + " - " + this.node2.toString();
  }
}

class Board {
  constructor(tileList) {
    this.tileList = tileList;
    this.lineList = [];
    this.distanceMatrix = tileList.map(() => tileList.map(() => UNINITIALIZED));
    this.maxDistance = -1;

    // Find boundaries for problem`
    this.maxBoundY = 0;
    this.maxBoundX = 0;
    this.tileList.forEach((tile) => {
      if (tile.x > this.maxBoundX) {
        this.maxBoundX = tile.x;
      }
      if (tile.y > this.maxBoundY) {
        this.maxBoundY = tile.y;
      }
    });
    console.log("instantiating map");
    this.map = [];
    for (let x = 0; x < this.maxBoundY; x++) {
      this.map.push([]);
    }
    console.log("Instantiated map");
    this.tileList.forEach((node, index) => {
      let previousNode = null;
      if (index === 0) {
        previousNode = this.tileList[this.tileList.length - 1];
      } else previousNode = this.tileList[index - 1];
      this.lineList.push(new Line(node, previousNode));
    });

    this.distanceMatrix.forEach((col, colIndex) => {
      col.forEach((_, rowIndex) => {
        if (rowIndex === colIndex) {
          this.distanceMatrix[colIndex][rowIndex] = -1;
          return;
        }

        const tileOne = this.tileList[colIndex];
        const tileTwo = this.tileList[rowIndex];
        let computedDistance = tileOne.getRectangleSize(tileTwo);
        // console.log(computedDistance);

        const nodeOne = new Node(0, tileOne.x, tileOne.y);
        const nodeTwo = new Node(0, tileOne.x, tileTwo.y);
        const nodeFour = new Node(0, tileTwo.x, tileOne.y);
        const nodeThree = new Node(0, tileTwo.x, tileTwo.y);

        const lineOne = new Line(nodeOne, nodeTwo);
        const lineTwo = new Line(nodeTwo, nodeThree);
        const lineThree = new Line(nodeThree, nodeFour);
        const lineFour = new Line(nodeFour, nodeOne);

        // console.log(lineOne, lineTwo, lineThree, lineFour);

        [lineOne, lineTwo, lineThree, lineFour].forEach((ghostLine) => {
          this.lineList.forEach((actualLine) => {
            if (ghostLine.isIntersecting(actualLine)) {
              // console.log("========================================");
              // console.log(ghostLine);
              // console.log(actualLine);
              // console.log("========================================");
              computedDistance = -1;
            }
          });
        });

        if (this.maxDistance === -1 || computedDistance > this.maxDistance) {
          this.maxDistance = computedDistance;
        }
        this.distanceMatrix[colIndex][rowIndex] = computedDistance;
        // this.distanceMatrix[rowIndex][colIndex] = computedDistance;
      });
    });
  }
}

// Boilerplate
async function solution(path) {
  const lineOne = new Line(new Node(0, 0, 0), new Node(0, 10, 0));
  const lineTwo = new Line(new Node(0, 5, 10), new Node(0, 5, -10));

  const fileStream = fs.createReadStream(path, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: fileStream,
  });

  let lineIndex = 0;
  let tileList = [];
  for await (const line of rl) {
    const split = line.split(",");
    const tile = new Node(lineIndex, split[0], split[1]);
    tileList.push(tile);
    lineIndex++;
  }

  const board = new Board(tileList);

  console.table(board.tileList);
  console.table(board.distanceMatrix);
  console.table(board.maxDistance);
  // console.log(board.maxBoundX, board.maxBoundY);
  // console.table(board.map);
  // board.lineList.map((i) => {
  //   console.log(i.node1.toString(), i.node2.toString());
  // });
}
solution(process.argv[2]);
