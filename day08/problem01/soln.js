import fs from "fs";
import readline from "readline";
import process from "process";

const UNINITIALIZED = "U";

class JunctionBox {
  constructor(id, x, y, z) {
    this.id = id;
    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
    this.connections = [];
  }

  getDistance(otherBox) {
    return Math.floor(
      Math.sqrt(
        Math.pow(this.x - otherBox.x, 2) +
          Math.pow(this.y - otherBox.y, 2) +
          Math.pow(this.z - otherBox.z, 2),
      ),
    );
  }

  toString() {
    return `${this.x}-${this.y}-${this.z}`;
  }
}

class Circuit {
  constructor() {
    this.boxList = [];
  }

  addBox(box) {
    this.boxList.push(box);
  }

  containsBox(box) {
    return this.boxList.find((i) => i.id === box.id);
  }

  compareBoxes(boxOne, boxTwo) {
    return boxOne.getDistance(boxTwo);
  }

  getDistance(otherCircuit, distanceMatrix) {
    const shortestDistances = this.boxList.map((b) => {
      const distances = otherCircuit.boxList.map((o) => distanceMatrix[o.id][b.id]);
      return Math.min(...distances);
    });
    return Math.min(...shortestDistances);
  }
}

class Diagram {
  constructor() {
    this.boxList = [];
    this.circuitList = [];
    this.distanceMatrix = [];
    this.lowest = [];
  }

  addCircuit(circuit) {
    this.circuitList.push(circuit);
  }

  addBox(box) {
    this.boxList.push(box);
  }

  findCircuitIdWithBoxId(id) {
    for (let circuitIndex = 0; circuitIndex < this.circuitList.length; circuitIndex++) {
      for (let boxIndex = 0; boxIndex < this.circuitList[circuitIndex].boxList.length; boxIndex++) {
        if (id === this.circuitList[circuitIndex].boxList[boxIndex].id) {
          console.log(id, this.circuitList[circuitIndex].boxList[boxIndex].id);
          return circuitIndex;
        }
      }
    }
  }

  getDistance(indexOne, indexTwo) {
    return this.circuitList[indexOne].getDistance(this.circuitList[indexTwo], this.distanceMatrix);
  }

  mergeCircuits(indexOne, indexTwo) {
    const secondBoxList = this.circuitList[indexTwo].boxList;
    secondBoxList.forEach((i) => this.circuitList[indexOne].addBox(i));
    this.circuitList[indexTwo] = undefined;
    this.circuitList = this.circuitList.filter((i) => i !== undefined);
  }

  buildDistanceMatrix() {
    // Instantiate
    this.distanceMatrix = this.boxList.map(() => this.boxList.map(() => UNINITIALIZED));

    // Processing time
    for (let columnIndex = 0; columnIndex < this.boxList.length; columnIndex++) {
      for (let rowIndex = columnIndex; rowIndex < this.boxList.length; rowIndex++) {
        if (this.distanceMatrix[columnIndex][rowIndex] === UNINITIALIZED) {
          const distance = this.boxList[columnIndex].getDistance(this.boxList[rowIndex]);
          this.distanceMatrix[columnIndex][rowIndex] = distance;
          this.distanceMatrix[rowIndex][columnIndex] = distance;
        }
      }
    }

    // Get rid of i === i comparisons
    for (let i = 0; i < this.boxList.length; i++) {
      this.distanceMatrix[i][i] = UNINITIALIZED;
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
  let lineIndex = 0;
  for await (const line of rl) {
    const split = line.split(",");
    const box = new JunctionBox(lineIndex, split[0], split[1], split[2]);
    const circuit = new Circuit();
    circuit.addBox(box);
    diagram.addCircuit(circuit);
    diagram.addBox(box);
    lineIndex++;
  }

  diagram.buildDistanceMatrix();

  for (let i = 0; i < 1000; i++) {
    let lowestIndexOne = 0;
    let lowestIndexTwo = 1;
    let lowestDistance = diagram.getDistance(lowestIndexOne, lowestIndexTwo);
    diagram.boxList.forEach((boxOne, indexOne) => {
      diagram.boxList.forEach((boxTwo, indexTwo) => {
        const candidateDistance = diagram.distanceMatrix[indexOne][indexTwo];
        if (candidateDistance !== UNINITIALIZED && candidateDistance < lowestDistance) {
          lowestIndexOne = indexOne;
          lowestIndexTwo = indexTwo;
          lowestDistance = candidateDistance;
        }
      });
    });
    const boxOneCircuitId = diagram.findCircuitIdWithBoxId(diagram.boxList[lowestIndexOne].id);
    const boxTwoCircuitId = diagram.findCircuitIdWithBoxId(diagram.boxList[lowestIndexTwo].id);
    diagram.distanceMatrix[lowestIndexOne][lowestIndexTwo] = UNINITIALIZED;
    diagram.distanceMatrix[lowestIndexTwo][lowestIndexOne] = UNINITIALIZED;
    if (boxOneCircuitId !== boxTwoCircuitId) {
      diagram.mergeCircuits(boxOneCircuitId, boxTwoCircuitId);
    }
  }

  console.table(diagram.circuitList.map((i) => i.boxList.map((j) => j.toString())));
  diagram.circuitList = diagram.circuitList.sort((a, b) => b.boxList.length - a.boxList.length);

  console.table(diagram.circuitList.map((i) => i.boxList.map((j) => j.toString())));

  const answer = diagram.circuitList.slice(0, 3).map((i) => i.boxList.length);
  console.log(answer[0] * answer[1] * answer[2]);
}
solution(process.argv[2]);
