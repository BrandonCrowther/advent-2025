import fs from "fs";
import readline from "readline";
import process from "process";

class InputDefucker {
  constructor() {
    this.rawLines = [];
    this.parsedLines = [];
    this.problems = [];
  }

  addLine(line) {
    this.rawLines.push(line);
    this.parsedLines.push([]);
  }

  // Detect segment lines and chop shit up
  segmentNumbers() {
    const lineLength = this.rawLines[0].length;
    let lastSegment = -1;
    for (let i = 0; i <= lineLength; i++) {
      // Strings out of bound return undefined. Weird eh
      const isSegmentDetected = !this.rawLines.find(
        (l) => l[i] !== " " && typeof l[i] !== "undefined",
      );

      if (isSegmentDetected) {
        console.log(`Found segment at ${i}`);
        this.rawLines.forEach((l, index) => {
          const slice = l.slice(lastSegment + 1, i).replaceAll(" ", "-");
          this.parsedLines[index].push(slice);
        });
        lastSegment = i;
      }
    }
    // Accidentally taking in the operation. Clean it up
    // Instantiate the problems while we're at it
    this.problems = this.parsedLines[this.parsedLines.length - 1].map(
      (i) => new MathProblem(i.replaceAll("-", "").trim()),
    );
    this.parsedLines.pop();
    console.table(this.parsedLines);
  }
  // We've got properly segmented lines with pads
  // let's convert this to something part 1 can handle
  convertToProblems() {
    for (let problemIndex = 0; problemIndex < this.parsedLines[0].length; problemIndex++) {
      for (let numberIndex = 0; numberIndex < this.parsedLines.length; numberIndex++) {
        this.problems[problemIndex].appendNumber(this.parsedLines[numberIndex][problemIndex]);
      }
    }
    console.log(this.problems);
    return this.problems;
  }
}

class MathProblem {
  constructor(operation) {
    this.numberList = [];
    this.operation = operation;
    this.answer = null;
  }

  appendNumber(symbol) {
    this.numberList.push(symbol);
  }
  rotateNumbers() {
    let newList = [];
    for (let characterIndex = 0; characterIndex < this.numberList[0].length; characterIndex++) {
      let newNumberString = "";
      for (let numberIndex = 0; numberIndex < this.numberList.length; numberIndex++) {
        const newCharacter = this.numberList[numberIndex].charAt(characterIndex);
        if (newCharacter !== "-") {
          newNumberString += newCharacter;
        }
      }
      newList.push(newNumberString);
    }
    this.numberList = newList;
  }
  applyOperation() {
    this.numberList = this.numberList.map((i) => Number(i));
    if (this.operation === "+") {
      const answer = this.numberList.reduce((a, x) => a + x, 0);
      this.answer = BigInt(answer);
      return answer;
    } else if (this.operation === "*") {
      const answer = this.numberList.reduce((a, x) => a * x, 1);
      this.answer = BigInt(answer);
      return answer;
    } else throw Error(`Invalid input ${this.operation}`);
  }
}

// Boilerplate
async function solution(path) {
  const fileStream = fs.createReadStream(path, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: fileStream,
  });

  const defucker = new InputDefucker();
  for await (const line of rl) {
    defucker.addLine(line);
  }
  defucker.segmentNumbers();

  const problemList = defucker.convertToProblems();
  console.log(problemList);
  problemList.map((i) => i.rotateNumbers());
  problemList.map((i) => i.applyOperation());
  console.log(problemList);
  console.log(problemList.map((i) => i.answer).reduce((i, j) => i + j, 0n));
}
solution(process.argv[2]);
