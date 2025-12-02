
import fs from 'fs';
import readline from 'readline';

class Solution {
    constructor() {
        this.finalAnswer = 0;
    }
    
    tally(lowerBound, upperBound) {
        let invalidIDs = [];
        for(let currentNumber = lowerBound; currentNumber <= upperBound; currentNumber++){
            const currentNumberString = currentNumber.toString();
              
            for(let endIndex = 1; endIndex < currentNumberString.length; endIndex++) {
                let patternMaintained = true;
                const currentSlice = currentNumberString.slice(0, endIndex);
                const afterSlice = currentNumberString.slice(endIndex, currentNumberString.length);
                let remainingString = afterSlice;

                while(patternMaintained === true) {
                    if(remainingString.slice(0, endIndex) == currentSlice) {
                        remainingString = remainingString.slice(endIndex, currentNumberString.length);
                    }
                    else patternMaintained = false
                }

                if (remainingString.length === 0 && !invalidIDs.find(i => i === currentNumber)) {
                    console.log(`Adding because ${afterSlice} includes ${currentSlice}`)
                    invalidIDs.push(currentNumber)
                }
            }
        }
        if(invalidIDs.length > 0) {
            console.log(`${lowerBound}-${upperBound} has ${invalidIDs.length} invalid IDs, ${invalidIDs.join(', ')}.`)
            this.finalAnswer += invalidIDs.reduce((i, j) => i + j)
        }
    }
}

async function solution(path) {
    const fileStream = fs.createReadStream(path, { encoding: 'utf8' });
    const rl = readline.createInterface({
        input: fileStream,
    });
    
    // Should only run once this time.
    const solution = new Solution();
    for await (const line of rl) {
        const rawRanges = line.split(",").map(i => i.split('-'))
        for(const range of rawRanges){
            solution.tally(
                Number(range[0]),
                Number(range[1])
            );
        }
    }
    console.log(`Solution: ${solution.finalAnswer}`)
}

solution('input');