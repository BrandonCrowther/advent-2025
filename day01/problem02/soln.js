// 0 - 99
// Each number has a small click
// My input starts with direction - L or R

import fs from "fs";
import readline from "readline";

class ElvishLock {
  constructor() {
    this.index = 50;
    this.finalAnswer = 0;
  }

  get getIndex() {
    return this.index;
  }

  // What a fucking mess god damn
  inputMove(directionIn, distanceIn) {
    let directionalizedDistance = null;
    let extraTurns = 0;
    let newIndex = 0;

    if (directionIn === "L") {
      const overTurns = Math.floor(distanceIn / 100);
      let trimmedDistance = distanceIn - overTurns * 100;
      directionalizedDistance = 0 - trimmedDistance;

      newIndex = (this.index + directionalizedDistance + 100) % 100;

      extraTurns += overTurns;
      const landedOnZero =
        this.index - trimmedDistance <= 0 && this.index !== 0;
      if (landedOnZero) {
        console.log("landed on zero");
        this.finalAnswer++;
      }
    } else if (directionIn === "R") {
      directionalizedDistance = distanceIn;
      let total = distanceIn + this.index;
      extraTurns += Math.floor(total / 100);
      newIndex = total % 100;
    } else throw new Error("Issue with inputs");

    // let newIndex = (this.index + directionalizedDistance + 100) % 100;

    let extraTurnStr = "";
    if (extraTurns > 0) {
      this.finalAnswer += extraTurns;
      extraTurnStr = `; during this rotation, it points at 0 ${extraTurns} times`;
    }
    console.log(
      `The dial is rotated ${directionIn}${distanceIn} to point at ${newIndex}${extraTurnStr}`,
    );
    console.log(`Score: ${this.finalAnswer}`);
    this.index = newIndex;
  }
}

async function solution(path) {
  const fileStream = fs.createReadStream(path, { encoding: "utf8" });
  const rl = readline.createInterface({
    input: fileStream,
  });

  const myLock = new ElvishLock();
  console.log(`The dial starts by pointing at ${myLock.index}`);
  for await (const line of rl) {
    myLock.inputMove(
      line.substring(0, 1),
      parseInt(line.substring(1, line.length)),
    );
  }
  console.log("Final Answer: " + myLock.finalAnswer);
}

solution("input");
// solution('inputExample');
