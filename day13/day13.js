fs = require('fs')
const input = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")
let folds = []
let max = 0
points = []
for (let line of input) {
    switch (true) {
        case /[0-9]+,[0-9]+/.test(line):
            let [x, y] = line.split(',')
            x = parseInt(x)
            y = parseInt(y)
            points.push([x, y])
            if (x > max) max = x
            if (y > max) max = y
            break
        case /fold along (x|y)=[0-9]+/.test(line):
            let splitline = line.split(" ")
            let fold = splitline[2].split("=")
            fold[1] = parseInt(fold[1])
            folds.push(fold)
            break
    }
}
let grid = Array.from({ length: max+1 }, () => (Array.from({ length: max+1 }, ()=>".")))
for (point of points) {
    grid[point[1]][point[0]] = "#"
}

// Fold
for (let fold of folds) {
    let prepend = []
    if (fold[0] == "y") {
        let slice = grid.splice(fold[1]+1, grid.length - fold[1])
        grid.pop()

        for (y = 0; y < slice.length; y++) {
            for(x = 0; x < slice[y].length; x++) {
                if (slice[y][x] == "#") {
                    grid[grid.length-1-y][x] = "#"
                }
            }
        }
    } else {
        // grid folding along X
        for (y = 0; y < grid.length; y++) {
            let slice = grid[y].splice(fold[1] + 1, grid[y].length - fold[1])
            grid[y].pop()
            for (x = 0; x < slice.length; x++) {
                if (slice[x] == "#") {
                    grid[y][grid[y].length-1-x] = "#"
                }
            }
        }
    }
    if (fold == folds[0]) {
        let count = 0
        for (y of grid) {
            for (x of y) {
                if (x == "#") count++
            }
        }
        console.log(count)
    }
}


console.log("\n\n***** PART 2 *****")
for (y of grid) {
    console.log(y.join(''))
}