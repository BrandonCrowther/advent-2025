import fs from "fs";
import readline from "readline";
import process from "process";

class Solution {
  constructor() {
    this.finalAnswer = 0;
    this.currentArray = [];
  }

  consumeLine(unsortedInput) {
    // First number absolutely cannot be the last
    this.currentArray = unsortedInput;
    let lineAnswers = [];

    for (let i = 11; i > 0; i--) {
      const iterationDigit = this.findHighest(i);
      this.currentArray = this.currentArray.slice(this.currentArray.indexOf(iterationDigit) + 1);
      lineAnswers.push(iterationDigit);
    }
    lineAnswers.push(this.findHighest(0));

    const joinedAnswer = Number(lineAnswers.join(""));
    this.finalAnswer += joinedAnswer;
    return joinedAnswer;
  }

  // Returns index of best choice within the space allowed (length - choicesRemaining)
  findHighest(remainingChoicesRequired) {
    const iterationProblemSpace = this.currentArray.slice(
      0,
      this.currentArray.length - remainingChoicesRequired,
    );
    const highestNumber = iterationProblemSpace.reduce((i, j) => (j > i ? j : i));

    // console.log("Chose: ", highestNumber, iterationProblemSpace.join(""));
    return highestNumber;
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
    const lineAsArray = line.split("").map((i) => Number(i));
    // console.log(lineAsArray);
    console.log(solution.consumeLine(lineAsArray));
  }
  console.log(solution.finalAnswer);
}
solution(process.argv[2]);
