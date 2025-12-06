import fs from "fs";
import readline from "readline";
import process from "process";

class MathProblem {
  constructor(initialSymbol) {
    this.numberList = [initialSymbol];
    this.operation = null;
    this.answer = null;
  }
  appendNumber(symbol) {
    this.numberList.push(symbol);
  }
  applyOperation(symbol) {
    this.operation = symbol;
    if (symbol === "+") {
      const answer = this.numberList.reduce((a, x) => a + x, 0);
      this.answer = BigInt(answer);
      return answer;
    } else if (symbol === "*") {
      const answer = this.numberList.reduce((a, x) => a * x, 1);
      this.answer = BigInt(answer);
      return answer;
    } else throw Error(`Invalid input ${symbol}`);
  }
}

// Boilerplate
async function solution(path) {
  const fileStream = fs.createReadStream(path, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: fileStream,
  });

  let problemList = [];
  for await (const line of rl) {
    const splitLine = line.trim().split(/\s+/);
    if (problemList.length === 0) {
      console.log(splitLine);
      problemList = splitLine.map((i) => new MathProblem(Number(i)));
    } else if (!isNaN(parseFloat(splitLine[0]))) {
      splitLine.forEach((n, i) => problemList[i].appendNumber(Number(n)));
    } else {
      splitLine.forEach((n, i) => problemList[i].applyOperation(n));
    }
  }
  console.log(problemList.map((i) => i.answer).reduce((i, j) => i + j, 0n));
}
solution(process.argv[2]);
