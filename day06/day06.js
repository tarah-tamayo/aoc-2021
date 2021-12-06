fs = require('fs')
let fish_input = fs.readFileSync('input', 'utf8').split(',')

console.log("***** PART 1 *****")
fish_input = fish_input.map((x) => parseInt(x))
let fish = Array(arrayLength=9).fill(0)
let fish_next = Array(arrayLength=9).fill(0)
for (f of fish_input) fish[f]++
console.log(`initial fish: ${fish.toString()}`)

function fish_days(start, end, fish) {
    for (let day = start; day <= end; day++) {
        for (let i = 0; i < 9; i++) {
            if (i === 0) {
                fish_next[6] += fish[i]
                fish_next[8] += fish[i]
            } else 
            {
                fish_next[i-1] += fish[i]
            }
        }
        for (let i = 0; i < 9; i++) fish[i] = fish_next[i]
        let count = fish.reduce((prev, current) => prev + current)
        console.log(`${day}: ${count} :: ${fish.toString()}`)
        fish_next.fill(0)
    }
}

fish_days(1, 80, fish)

console.log("\n\n***** PART 2 *****")
fish_days(81, 256, fish)