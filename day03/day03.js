const { O_TRUNC } = require('constants')

fs = require('fs')
const readings = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")
let values = []
let midpoint = readings.length / 2
for (reading of readings) {
    for (let i = 0; i < reading.length; i++) {
        if (i+1 > values.length) {
            values.push(0)
        }
        values[i] += parseInt(reading[i])
    }
}

let gammabin = ""
let epsilonbin = ""
for (value of values) {
    if (parseInt(value) > midpoint) {
        gammabin += "1"
        epsilonbin += "0"
    } else {
        gammabin += "0"
        epsilonbin += "1"
    }
}
console.log(`${gammabin} ... ${epsilonbin}`)
gamma = parseInt(gammabin, 2)
epsilon = parseInt(epsilonbin, 2)
console.log(gamma * epsilon)


console.log("\n\n***** PART 2 *****")
o2 = []
co2 = []
for (reading of readings) {
    if (reading[0] == gammabin[0]) {
        o2.push(reading)
    } else co2.push(reading)
}
let pos = 1
while (o2.length > 1) {
    let ones = 0
    for (reading of o2) {
        if (reading[pos] == "1") ones++
    }
    if (ones >= o2.length/2) match = "1"; else match = "0"
    for (let i = o2.length-1; i >= 0; i--) {
        if (o2[i][pos] != match) {
            o2.splice(i, 1)
        }
    }
    pos++
}
o2 = o2[0]
pos = 1
while (co2.length > 1) {
    let ones = 0
    for (reading of co2) {
        if (reading[pos] == "1") ones++
    }
    if (ones >= co2.length/2) match = "0"; else match = "1"
    for (let i = co2.length-1; i >= 0; i--) {
        if (co2[i][pos] != match) {
            co2.splice(i, 1)
        }
    }
    pos++
}
co2 = co2[0]
console.log(`${o2} ... ${co2}`)
console.log(parseInt(o2, 2) * parseInt(co2, 2))