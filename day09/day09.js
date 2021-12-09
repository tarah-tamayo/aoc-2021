fs = require('fs')
const input = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")
let map = [Array(arrayLength=input[0].length+2).fill(9)]
for (line of input) {
    let map_line = Array.from(line).map((x) => parseInt(x))
    map_line.unshift(9)
    map_line.push(9)
    map.push(map_line)
}
map.push(Array(arrayLength=input[0].length+2).fill(9))
let risk = 0
for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[i].length - 1; j++) {
        let low = true
        if (map[i][j] >= map[i][j-1]) low = false
        if (map[i][j] >= map[i-1][j]) low = false
        if (map[i][j] >= map[i][j+1]) low = false
        if (map[i][j] >= map[i+1][j]) low = false
        if (low) risk += map[i][j] + 1
    }
}
console.log(risk)


console.log("\n\n***** PART 2 *****")
basin_sizes = []
for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[i].length - 1; j++) {
        if ((map[i][j] != 9) && (map[i][j] != ".")) {
            let size = 0
            let points = [[i,j]]
            while (points.length > 0) {
                let [a, b] = points.pop()
                if (map[a][b] != ".") {
                    map[a][b] = "."
                    size++
                }
                if ((map[a][b+1] != 9) && (map[a][b+1] != ".")) 
                    points.push([a,b+1])
                if ((map[a][b-1] != 9) && (map[a][b-1] != ".")) 
                    points.push([a,b-1])
                if ((map[a+1][b] != 9) && (map[a+1][b] != ".")) 
                    points.push([a+1,b])
                if ((map[a-1][b] != 9) && (map[a-1][b] != ".")) 
                    points.push([a-1,b])
            }
            basin_sizes.push(size)
        }
    }
}
let top3 = [0, 0, 0]
for (let size of basin_sizes) {
    if (size > top3[2]) {
        top3.shift()
        top3.push(size)
    } else if (size > top3[1]) {
        top3[0] = top3[1]
        top3[1] = size
    } else if (size > top3[0]) top3[0] = size
}
console.log("----- MAP -----")
for (line of map) console.log(line.toString())
console.log("---------------")
console.log(basin_sizes.toString())
console.log(top3)
console.log(top3[0] * top3[1] * top3[2])