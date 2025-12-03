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

  inputMove(directionIn, distanceIn) {
    let directionalizedDistance = null;
    if (directionIn === "L") {
      directionalizedDistance = 0 - distanceIn;
    } else if (directionIn === "R") {
      directionalizedDistance = distanceIn;
    } else throw new Error("Issue with inputs");

    this.rotateLock(directionalizedDistance);
    console.log(
      `The dial is rotated ${directionIn}${distanceIn} to point at ${this.index}`,
    );
  }

  rotateLock(directionalizedDistance) {
    this.index = (this.index + directionalizedDistance + 100) % 100;
    if (this.index === 0) {
      this.finalAnswer++;
      console.log(`Final Answer++: ${this.finalAnswer}`);
    }
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
