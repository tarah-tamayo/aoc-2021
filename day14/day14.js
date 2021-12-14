fs = require('fs')
let input = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")
let template = input.shift()
input.shift() // blank line follows template
let pair_rules = new Map()
let pairs = new Map()
for (line of input) {
    let [rule, insertion] = line.split(' -> ')
    pair_rules.set(rule, insertion)
    pairs.set(rule, [0, 0]) // [current_step, next_step]
}

// Count template
for (let i = 0; i < template.length - 1; i++) {
    let temp_pair = template[i] + template[i+1]
    if (pairs.has(temp_pair)) {
        let pair = pairs.get(temp_pair)
        pair[0]++
    } else pairs.set(temp_pair, [1, 0])
}

// Cycle to step 10
function cycle(start, end, pair_rules, pairs) {
    for (let step = start; step <= end; step++) {
        let i = 1
        for (let key of pairs.keys()) {
            let left = key[0]
            let right = key[1]
            let middle = pair_rules.get(key)
            let left_pair = left + middle
            let right_pair = middle + right
            pairs.get(left_pair)[1] += pairs.get(key)[0]
            pairs.get(right_pair)[1] += pairs.get(key)[0]
            i += pairs.get(key)[0] * 2
        }
        for (let val of pairs.values()) {
            val[0] = val[1]
            val[1] = 0
        }
        console.log(`Step #${step}: ${i}`)
    }
}

cycle(1, 10, pair_rules, pairs)

function count_elements(pairs, count) {
    for (let key of pairs.keys()) {
        let key_left = key[0]
        let key_right = key[1]
        if (!count.has(key_left))
            count.set(key_left, 0)
        if(!count.has(key_right))
            count.set(key_right, 0)
        count.set(key_left, count.get(key_left) + pairs.get(key)[0])
        count.set(key_right, count.get(key_right) + pairs.get(key)[0])
    }
    count.set(template[0], count.get(template[0]) + 1)
    count.set(template[template.length-1], count.get(template[template.length-1]) + 1)
}

let count = new Map()
count_elements(pairs, count)
let max = 0
let min = Infinity
for (c of count.values()) {
    if (c/2 > max) max = c/2
    if (c/2 < min) min = c/2
}
console.log(max-min)


console.log("\n\n***** PART 2 *****")
cycle(11, 40, pair_rules, pairs)
count.clear()
count_elements(pairs, count)
max = 0
min = Infinity
for (c of count.values()) {
    if (c/2 > max) max = c/2
    if (c/2 < min) min = c/2
}
console.log(max-min)