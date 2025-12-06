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
}

class Solution {
  constructor() {
    this.inventory = [];
    this.finalAnswer = 0;
  }

  addToInventory(lowerBound, upperBound) {
    if (lowerBound >= Number.MAX_VALUE) {
      throw Error(`${lowerBound} exceeds ${Number.MAX_VALUE}`);
    }
    if (upperBound >= Number.MAX_VALUE) {
      throw Error(`${lowerBound} exceeds ${Number.MAX_VALUE}`);
    }
    this.inventory.push(new Bound(lowerBound, upperBound));
    console.log(`Added ${lowerBound} - ${upperBound}!`);
  }

  scanInventory(ingredient) {
    if (ingredient >= Number.MAX_VALUE) {
      throw Error(`${ingredient} exceeds ${Number.MAX_VALUE}`);
    }
    const scanResult = this.inventory.filter((i) => i.checkBoundary(ingredient));
    if (scanResult.length > 0) {
      console.log(`Ingredient ${ingredient} is fresh!`);
      // console.table(scanResult.map((i) => [i.lowerBound, i.upperBound]));
      this.finalAnswer++;
    } else console.log(`Ingredient ${ingredient} is spoiled.`);
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

  for await (const line of rl) {
    solution.scanInventory(Number(line));
  }
  console.log(solution.inventory.length);
  console.log(solution.finalAnswer);
}
solution(process.argv[2]);
