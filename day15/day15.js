
fs = require('fs')
let input = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")
class Node {
    constructor(x, y, risk) {
        this.pos = [x,y]
        this.risk = risk
        this.north = null
        this.south = null
        this.east = null
        this.west = null
        this.sumN = Infinity
        this.sumW = Infinity
        this.sumE = Infinity
        this.sumS = Infinity
        this.sum = Infinity
    }
    getDir() {
        if ((this.north === null) && (this.west === null)) return this
        switch (this.sum - this.risk) {
            case this.sumN:
                return this.north
            case this.sumW:
                return this.west
            case this.sumE:
                return this.east
            case this.sumS:
                return this.south
        }
    }
    getSum() {
        if ((this.north === null) && (this.west === null))
            this.sum = 0;
        else
            this.sum = Math.min(this.sumN, this.sumS, this.sumE, this.sumW) + this.risk
    }
    toString() {
        return `${this.pos.toString()}: ${this.risk} -> N=${this.sumN} S=${this.sumS} E=${this.sumE} W=${this.sumW}`
    }
}

grid = []
let y = 0
for (let i = 0; i < 5; i++) {
    for (line of input) {
        let x = 0
        let nodes = []
        for (let j = 0; j < 5; j++) {
            for (d of line) {
                let value = parseInt(d) + i + j
                if (value > 9) value -= 9
                let node = new Node(x, y, value)
                nodes.push(node)
                x++
            }
        }
        grid.push(nodes)
        y++
    }
}
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
        if (x != grid[0].length-1) {
            grid[y][x].east = grid[y][x+1]
            grid[y][x+1].west = grid[y][x]
        }
        if (y != grid.length-1) {
            grid[y][x].south = grid[y+1][x]
            grid[y+1][x].north = grid[y][x]
        }
    }
}
let start = grid[0][0]
let end = grid[input.length-1][input[0].length-1]
let min = Infinity
// limit to south and east for now
let current = start

// Get path costs. Need to repeat N times
for (N = 0; N < grid.length; N++) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid.length; x++) {
            // North
            if ((grid[y][x].north === null) || (grid[y][x].north.getDir() == grid[y][x]))
                grid[y][x].sumN = Infinity;
            else grid[y][x].sumN = grid[y][x].north.sum + grid[y][x].risk
            // West
            if ((grid[y][x].west === null) || (grid[y][x].west.getDir() == grid[y][x]))
                grid[y][x].sumW = Infinity;
            else grid[y][x].sumW = grid[y][x].west.sum + grid[y][x].risk
            // South
            if ((grid[y][x].south === null) || (grid[y][x].south.getDir() == grid[y][x]))
                grid[y][x].sumS = Infinity;
            else grid[y][x].sumS = grid[y][x].south.sum + grid[y][x].risk
            // East
            if ((grid[y][x].east === null) || (grid[y][x].east.getDir() == grid[y][x]))
                grid[y][x].sumE = Infinity;
            else grid[y][x].sumE = grid[y][x].east.sum + grid[y][x].risk
            grid[y][x].getSum()
        }
    }
}

console.log(end.sum - start.risk)
current = end
let path = []
while (current != start) {
    console.log(current.toString())
    path.push(current.risk)
    current = current.getDir()
}
console.log(path.reduce((prev, curr) => prev + curr))

console.log("\n\n***** PART 2 *****")
path = []
end = grid[grid.length-1][grid[0].length-1]
console.log(end.sum - start.risk)
current = end
while (current != start) {
    console.log(current.toString())
    path.push(current.risk)
    current = current.getDir()
}
console.log(path.reduce((prev, curr) => prev + curr))

console.log(`\nValidate 5x5 grid at origin Risk = ${grid[0][0].risk}`)
let sizeY = input.length
let sizeX = input[0].length
for (let Y = 0; Y < 5; Y++) {
    let strout = ""
    for (let X = 0; X < 5; X++) {
        strout += `${grid[Y*sizeY][X*sizeX].risk}`
    }
    console.log(strout)
}