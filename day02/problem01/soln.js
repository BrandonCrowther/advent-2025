
import fs from 'fs';
import readline from 'readline';


class Solution {
    constructor() {
        this.finalAnswer = 0;
    }
    
    tally(lowerBound, upperBound) {
        // console.log(`Starting: ${lowerBound} ${upperBound}`)
        let invalidIDs = [];
        for(let currentNumber = lowerBound; currentNumber <= upperBound; currentNumber++){
            const currentNumberString = currentNumber.toString();
            
            const currentSlice = currentNumberString.slice(0, currentNumberString.length / 2);
            const afterSlice = currentNumberString.slice(currentNumberString.length / 2, currentNumberString.length);
            
            if (afterSlice == currentSlice && !invalidIDs.find(i => i === currentNumber)) {
                // console.log(`Adding because ${afterSlice} includes ${currentSlice}`)
                invalidIDs.push(currentNumber)
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