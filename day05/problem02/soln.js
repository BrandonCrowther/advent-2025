import fs from "fs";
import readline from "readline";
import process from "process";

class Bound {
  constructor(lowerBound, upperBound) {
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
  }
  checkBoundary(number) {
    return number >= this.lowerBound && number <= this.upperBound;
  }
  size() {
    const ret = this.upperBound + 1n - this.lowerBound;
    return ret >= 0 ? ret : 0;
    // return this.upperBound - this.lowerBound + 1;
  }
}

class Solution {
  constructor() {
    this.inventory = [];
    this.cleanedInventory = [];
    this.finalAnswer = 0;
  }

  addToInventory(lowerBound, upperBound) {
    this.inventory.push(new Bound(lowerBound, upperBound));
  }

  simplify() {
    for (let i = 0; i < this.inventory.length - 1; i++) {
      if (this.inventory[i].upperBound > this.inventory[i + 1].lowerBound) {
        this.inventory[i].upperBound = this.inventory[i + 1].lowerBound - 1n;
      }
    }
  }

  cleanInventory() {
    this.cleanedInventory.push(this.inventory[0]);
    for (let i = 1; i < this.inventory.length; i++) {
      const newRange = this.inventory[i];
      const previousRange = this.cleanedInventory[this.cleanedInventory.length - 1];
      // Need to merge
      if (previousRange.upperBound >= newRange.lowerBound) {
        if (newRange.upperBound > previousRange.upperBound) {
          this.cleanedInventory[this.cleanedInventory.length - 1].upperBound = newRange.upperBound;
        }
      } else this.cleanedInventory.push(newRange);
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
    solution.addToInventory(BigInt(split[0]), BigInt(split[1]));
  }

  console.log(solution.inventory);
  solution.inventory.sort((a, b) =>
    a.lowerBound === b.lowerBound ? 0 : a.lowerBound < b.lowerBound ? -1 : 1,
  );
  console.log(solution.inventory);
  solution.cleanInventory();
  console.log(solution.cleanedInventory);
  // solution.scanInventory();

  const finalAnswer = solution.cleanedInventory.reduce((i, j) => i + j.size(), 0n);
  console.log(finalAnswer);
  console.log(solution.finalAnswer);
}
solution(process.argv[2]);

// 332998283036769n
