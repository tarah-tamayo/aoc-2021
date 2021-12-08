const { off } = require('process')

fs = require('fs')
const input = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")
let num1478 = 0
for (let line of input) {
    let [seq, display] = line.split('|')
    let digits = display.split(' ')
    for (const digit of digits) {
        switch (digit.length) {
            case 2:
            case 3:
            case 4:
            case 7:
                num1478++
                break;
        }
    }
}
console.log(num1478)


console.log("\n\n***** PART 2 *****")
let displays = []
for (let line of input) {
    let [seq, display] = line.split('|')
    seq = seq.trim().split(' ').sort((a, b) => a.length - b.length)
    display = display.trim().split(' ')
    let nums = Array(10)
    /* Seq always has digits 0-9, not in order. To differentiate them, we need to find the
    unique digits (1, 4, 7, 8). Digit lengths are, in order of length:
    1: len 2
    7: len 3
    4: len 4
    2, 3, 5: len 5
    0, 6, 9: len 6
    8: len 7

    In 7 segment display:
      aa      0 = abcefg, 1 = cf,     2 = acdeg, 3 = acdfg,   4 = bcdf
     b  c     5 = abdfg,  6 = abdefg, 7 = acf,   8 = abcdefg, 9 = abcdfg
      dd
     e  f     4 - 1, in len 5 = 5
      gg      5 in len 6 = 6 (if not 7) or 9 (if 7)
              remaining len 6 = 0
              7 in remaining = 3
              last = 2

              0, 1, 4, 5, 6, 7, 8, 9 == need 2, 3
    */
    nums[1] = seq[0] // smallest length is always a 1
    nums[7] = seq[1] // next smallest is always a 7
    nums[4] = seq[2] // ...
    nums[8] = seq[9] // largest by length is 8
    let len5 = [seq[3], seq[4], seq[5]]
    let len6 = [seq[6], seq[7], seq[8]]
    // Find 5
    let sub = []
    for (c of nums[4]) {
        if (!nums[1].includes(c)) sub.push(c)
    }
    for (let i = 0; i < len5.length; i++) {
        let five = true
        for (c of sub) {
            if (!len5[i].includes(c)) five = false
        }
        if (five) {
            nums[5] = len5[i]
            len5.splice(i,1)
            break
        }
    }

    // Find 9
    sub = Array.from(nums[5])
    sub7 = Array.from(nums[7])
    for (let i = 0; i < len6.length; i++) {
        let nine = true
        for (c of sub.concat(sub7)) {
            if (!len6[i].includes(c)) nine = false
        }
        if (nine) {
            nums[9] = len6[i]
            len6.splice(i,1)
            break
        }
    }

    // Find 6
    for(let i = 0; i < len6.length; i++) {
        let six = true
        for (c of sub) {
            if (!len6[i].includes(c)) six = false
        }
        if (six) {
            nums[6] = len6[i]
            len6.splice(i,1)
            break
        }
    }

    // Lat len6 is 0
    nums[0] = len6[0]
    
    // Find 3
    for(let i = 0; i < len5.length; i++) {
        let three = true
        for (c of sub7) {
            if (!len5[i].includes(c)) three = false
        }
        if (three) {
            nums[3] = len5[i]
            len5.splice(i,1)
            break
        }
    }

    // Last len5 is 2
    nums[2] = len5[0]

    // Decode Display
    out = ""
    for (const digit of display) {
        for (let i = 0; i < nums.length; i++) {
            if (nums[i].length == digit.length) {
                let found = true
                for (c of digit) {
                    if (!nums[i].includes(c)) found = false
                }
                if (found) out += `${i}`
            }
        }
    }
    displays.push(parseInt(out))
}

sum = displays.reduce((prev, current) => prev + current)
console.log(sum)