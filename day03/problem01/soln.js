import fs from "fs";
import readline from "readline";
import process from "process";

class Solution {
  constructor() {
    this.finalAnswer = 0;
  }

  consumeLine(unsortedInput) {
    // First number absolutely cannot be the last
    const sortedFirstPool = unsortedInput.slice(0, -1).sort((a, b) => b - a);
    const firstDigit = sortedFirstPool[0];
    const firstDigitIndex = unsortedInput.indexOf(firstDigit);

    const sortedSecondPool = unsortedInput
      .slice(firstDigitIndex + 1)
      .sort((a, b) => b - a);

    const secondDigit = sortedSecondPool[0];

    const lineAnswer = Number(`${firstDigit}${secondDigit}`);
    this.finalAnswer += lineAnswer;

    return lineAnswer;
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
    console.log(lineAsArray);
    console.log(solution.consumeLine(lineAsArray));
  }
  console.log(solution.finalAnswer);
}
solution(process.argv[2]);
