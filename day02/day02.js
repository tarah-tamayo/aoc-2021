fs = require('fs')
const commands = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")
let dist = 0
let depth = 0

for (command of commands) {
    let [instruction, value] = command.split(' ')
    value = parseInt(value)
    switch (instruction) {
        case 'forward':
            dist += value
            break
        case 'up':
            depth -= value
            break
        case 'down':
            depth += value
            break
    }
}
console.log(`final location: ${dist} at depth ${depth}.`)
console.log(`answer: ${dist * depth}`)

let aim = 0
dist = 0
depth = 0
console.log("\n\n***** PART 2 *****")
for (command of commands) {
    [instruction, value] = command.split(' ')
    value = parseInt(value)
    switch (instruction) {
        case 'forward':
            dist += value
            depth += aim * value
            break
        case 'up':
            aim -= value
            break
        case 'down':
            aim += value
            break
    }
}
console.log(`final location: ${dist} at depth ${depth} with aim ${aim}.`)
console.log(`answer: ${dist * depth}`)