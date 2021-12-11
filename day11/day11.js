fs = require('fs')
const input = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")
octoray = []
for (let line of input) {
    octoray.push(Array.from(line).map((x) => parseInt(x)))
}
let flashes = 0
const octopi = octoray.length * octoray[0].length
let flash_step = 0
let step = 0
while (flash_step != octopi) {
    step++
    flash_step = 0
    // First increment all
    for (let i = 0; i < octoray.length; i++) {
        for (let j = 0; j < octoray[i].length; j++) {
            octoray[i][j]++
        }
    }
    // Check for flashes
    let done = false
    while (!done) {
        done = true
        for (let i = 0; i < octoray.length; i++) {
            let imax = octoray.length - 1
            for (let j = 0; j < octoray[i].length; j++) {
                let jmax = octoray[i].length - 1
                if (octoray[i][j] > 9) {
                    done = false
                    flash_step++
                    octoray[i][j] = 0
                    if (i > 0)
                        if (octoray[i-1][j] != 0) octoray[i-1][j]++
                    if (j > 0)
                        if (octoray[i][j-1] != 0) octoray[i][j-1]++
                    if ((i > 0) && (j > 0))
                        if (octoray[i-1][j-1] != 0) octoray[i-1][j-1]++
                    if (i < imax)
                        if (octoray[i+1][j] != 0) octoray[i+1][j]++
                    if (j < imax)
                        if (octoray[i][j+1] != 0) octoray[i][j+1]++
                    if ((i < imax) && (j < jmax))
                        if (octoray[i+1][j+1] != 0) octoray[i+1][j+1]++
                    if ((i < imax) && (j > 0))
                        if (octoray[i+1][j-1] != 0) octoray[i+1][j-1]++
                    if ((i > 0) && (j < jmax))
                        if (octoray[i-1][j+1] != 0) octoray[i-1][j+1]++
                }
            }
        }
    }
    if (step <= 100) flashes += flash_step
}
console.log(flashes)

console.log("\n\n***** PART 2 *****")
console.log(step)