fs = require('fs')
let crabs = fs.readFileSync('input', 'utf8').split(',')

console.log("***** PART 1 *****")
crabs = crabs.map((x) => parseInt(x))
crabs.sort((a, b) => a - b)
console.log(`crabs: ${crabs.toString()}`)

let sum = 0
let crabs_left = [0]
for (let i = 1; i < crabs.length; i++) {
    if (crabs[i] === crabs[i-1]) {
        crabs_left.push(crabs_left[i-1]);
    }
    else {
        sum = crabs_left[i-1] + 
              (crabs[i] - crabs[i-1]) * i
        crabs_left.push(sum)
    }
}
console.log(`crabs_left: ${crabs_left.toString()}`)

sum = 0
let crabs_right = [0]
for (let i = crabs.length-2; i >= 0; i--) {
    if (crabs[i] === crabs[i+1]) crabs_right.unshift(crabs_right[0]);
    else {
        sum = crabs_right[0] +
              (crabs[i+1] - crabs[i]) * crabs_right.length
        crabs_right.unshift(sum)
    }
}
console.log(`crabs_right: ${crabs_right.toString()}`)

let fuel = Infinity
let best_pos = -1
let i = 0
for (let pos = crabs[0]; pos <= crabs[crabs.length-1]; pos++) {
    while (crabs[i] <= pos) i++
    let left = 0
    let right = 0
    if (i>0) {
        left = crabs_left[i-1] + 
               (pos - crabs[i-1])*(i-1)
    }
    if (i+1 < crabs.length) {
        let n = crabs.length-i-1
        right = crabs_right[i+1] +
                (crabs[i+1] - pos)*n
    }
    sum = left + right + crabs[i] - pos
    if (sum < fuel) {
        fuel = sum
        best_pos = pos
    }
    console.log(`pos: ${pos} i: ${i} left: ${left} right: ${right} sum: ${sum} fuel: ${fuel} pos: ${best_pos}`)
}
console.log(`fuel: ${fuel}  pos: ${best_pos}`)