fs = require('fs')
const data = fs.readFileSync('input', 'utf8').split('\n')

class Line {
    start = []
    end = []

    constructor(line) {
        let points = line.split(/(,| -> )/)
        // only even indices because regex split includes parens captures
        this.start = [parseInt(points[0]), parseInt(points[2])]
        this.end = [parseInt(points[4]), parseInt(points[6])]
        this.normalize()
    }

    #swap() {
        let point = this.start
        this.start = this.end
        this.end = point
    }

    normalize() {
        if (this.start[0] > this.end[0]) this.#swap();
        if (this.start[1] > this.end[1]) this.#swap();
    }

    isHorizontal() {
        if (this.start[1] === this.end[1]) return true
        return false
    }

    isVertical() {
        if (this.start[0] === this.end[0]) return true
        return false
    }

    getPoints() {
        let points = []
        let dx = this.end[0] - this.start[0]
        if (dx != 0) {
            dx = dx / Math.abs(dx);
        }
        let dy = this.end[1] - this.start[1]
        if (dy != 0) {
            dy = dy / Math.abs(dy)
        }
        let x = this.start[0]
        let y = this.start[1]
        while ((x != this.end[0]) || (y != this.end[1])) {
            points.push([x,y])
            x += dx
            y += dy
        }
        points.push([x,y])
        return points
    }
}

console.log("***** PART 1 *****")
let horizontals = []
let verticals = []
let diagonals = []
let grid = Array.from({ length: 1000 }, () => (Array.from({ length: 1000 }, ()=>0)))
for (datum of data) {
    let line = new Line(datum)
    if (line.isHorizontal()) {
        horizontals.push(line)
    } else if (line.isVertical()) {
        verticals.push(line)
    }
    if (line.isHorizontal() || line.isVertical()) {
        for (point of line.getPoints()) {
            grid[point[1]][point[0]] += 1
        }
    } else diagonals.push(line)
}
let count = 0
for (let y = 0; y < 1000; y++) {
    for (let x = 0; x < 1000; x++) {
        if (grid[y][x] > 1) count++
    }
}
console.log(count)

console.log("\n\n***** PART 2 *****")
for (let line of diagonals) {
    for (point of line.getPoints())
        grid[point[1]][point[0]] += 1
}
count = 0
for (let y = 0; y < 1000; y++) {
    for (let x = 0; x < 1000; x++) {
        if (grid[y][x] > 1) count++
    }
}
console.log(count)