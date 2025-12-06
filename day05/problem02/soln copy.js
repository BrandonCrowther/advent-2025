import fs from "fs";
import readline from "readline";
import process from "process";

class Solution {
  constructor() {
    this.inventory = new Set();
    this.finalAnswer = 0;
  }

  addToInventory(lowerBound, upperBound) {
    for (let i = lowerBound; i <= upperBound; i++) {
      this.inventory.add(i);
    }
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
    if (line.length === 0) {
      break;
    }
    const split = line.split("-");
    solution.addToInventory(Number(split[0]), Number(split[1]));
  }

  console.log(solution.inventory);

  console.log(solution.inventory.size);
}
solution(process.argv[2]);
