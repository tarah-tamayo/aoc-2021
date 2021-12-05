fs = require('fs')
let depths = fs.readFileSync('input', 'utf8').split('\n')

console.log("\n\n***** PART 1 *****")
let total_increase = 0
let prev = Infinity
for (depth of depths) {
    if (parseInt(depth) > prev) total_increase++
    prev = parseInt(depth)
}
console.log(total_increase)

function sum(arr) {
    out = 0
    for (num of arr) {
        out += num
    }
    return out
}

console.log("\n\n***** PART 2 *****")
total_increase = 0
prev = Infinity
let window = []
for (depth of depths) {
    const d = parseInt(depth)
    window.push(d)
    if (window.length > 3) window.shift()
    if (window.length === 3) {
        current = sum(window)
        if (current > prev) {
            total_increase++
        }
        prev = current
    }
}
console.log(total_increase)