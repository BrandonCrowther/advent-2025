import fs from "fs";
import readline from "readline";
import process from "process";

const UNINITIALIZED = "U";
const VALID_TILE = "X";
const MARKER_TILE = "O";

class Edge {
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

class Line {
  constructor(node1, node2) {
    this.node1 = node1;
    this.node2 = node2;
  }

  isVertical() {
    this.node1.x === this.node2.x;
  }

  isHorizontal() {
    !this.isVertical();
  }

  isCuts(otherNode1, otherNode2) {
    // Can't intersect if joined together
    if (this.hasNode(otherNode1) || this.hasNode(otherNode2)) {
      return false;
    }
    const isOtherVertical = new Line(otherNode1, otherNode2).isVertical();

    if (this.isVertical()) {
      // Can't intersect if parallel
      if (isOtherVertical) {
        return false;
      }
      // Check if this.y ever becomes othernode1/2.y
      // AND lowerbound < this.x < upperbound
      const lowerBoundX = Math.min(otherNode1.x, otherNode2.x);
      const upperBoundX = Math.max(otherNode1.x, otherNode2.x);
      const lowerBoundY = Math.min(this.node1.x, this.node2.x);
      const upperBoundY = Math.max(this.node1.x, this.node2.x);
      if (
        lowerBoundX < this.node1.x &&
        this.node1.x < upperBoundX &&
        lowerBoundY < this.otherNode1.y &&
        this.otherNode1.y < upperBoundY
      ) {
      }
    } else {
      // Can't intersect if parallel
      if (!isOtherVertical) {
        return false;
      }
      // Check if this.x ever becomes othernode1/2.x
    }
    return false;
  }

  hasNode(otherNode) {
    return (
      (this.node1.x === otherNode.x && this.node1.y === otherNode.y) ||
      (this.node2.x === otherNode.x && this.node2.y === otherNode.y)
    );
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
        const computedDistance = this.tileList[colIndex].getRectangleSize(this.tileList[rowIndex]);
        if (this.maxDistance === -1 || computedDistance > this.maxDistance) {
          this.maxDistance = computedDistance;
        }
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
    const tile = new Edge(lineIndex, split[0], split[1]);
    tileList.push(tile);
    lineIndex++;
  }

  const board = new Board(tileList);

  console.table(board.tileList);
  console.table(board.distanceMatrix);
  console.table(board.maxDistance);
  // console.log(board.maxBoundX, board.maxBoundY);
  console.table(board.map);
}
solution(process.argv[2]);

// console.log("Beginning index ", node);
// let previousNode = null;
// if (index === 0) {
//   previousNode = this.tileList[this.tileList.length - 1];
// } else previousNode = this.tileList[index - 1];

// console.table(this.map);

// console.log("processing horizontals");
// if (node.x === previousNode.x) {
//   const lowestY = Math.min(previousNode.y, node.y);
//   const highestY = Math.max(previousNode.y, node.y);
//   // console.log(lowestY, highestY);
//   for (let y = lowestY - 1; y < highestY; y++) {
//     console.log(y - 1, node.x - 1);
//     this.map[y][node.x - 1] = VALID_TILE;
//   }
// }

// console.log("processing verticals");
// if (node.y === previousNode.y) {
//   const lowestX = Math.min(previousNode.x, node.x);
//   const highestX = Math.max(previousNode.x, node.x);
//   for (let x = lowestX - 1; x < highestX; x++) {
//     this.map[node.y - 1][x] = VALID_TILE;
//   }
// }
