const path = require('path')

fs = require('fs')
const input = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")

class Node {
    constructor(name) {
        this.name = name
        this.paths = []
        if (name ==  name.toUpperCase())
            this.revisit = true;
        else
            this.revisit = false
            this.visited = false
            this.revisited = false
    }
    [Symbol.toPrimitive](hint) {
        switch (hint) {
            case "string":
            default:
                return this.name
        }
    }
    addConnection(node) {
        this.paths.push(node)
    }
    toString() {
        let out = `${this.name} --> `
        for (let i = 0; i < this.paths.length; i++) {
            out += this.paths[i].name
            if (i != this.paths.length - 1)
                out += ", "
        }
        return out
    }
    getPaths(start, end, revisits = 0, currentPath = [], debug = "") {
        let current = currentPath.map((x) => x)
        current.push(this.name)
        //console.log(`${debug}${this} ${revisits}: ${currentPath}`)
        let out = []
        if (end === this)
            return [[this.name]]
        if (this.visited) {
            revisits--
            this.revisited = true
        }
        if (!this.revisit) this.visited = true
        for (let next of this.paths) {
            if (((!next.visited) || (revisits > 0)) && (next != start)) {
                //console.log(`${debug}  -> ${next} ${revisits} ${next.visited}`)
                let next_paths = next.getPaths(start, end, revisits, current, debug+"  ")
                for (let n of next_paths) {
                    n.unshift(this.name)
                }
                out = out.concat(next_paths)
            }
        }
        if (this.revisited)
            this.revisited = false;
        else
            this.visited = false
        return out
    }
}

let start = new Node("start")
let end = new Node("end")
let nodes = new Map()
nodes.set("start", start)
nodes.set("end", end)
for (let line of input) {
    let [source, dest] = line.split('-')
    if (!nodes.has(source))
        nodes.set(source, new Node(source))
    if (!nodes.has(dest))
        nodes.set(dest, new Node(dest))
    nodes.get(source).addConnection(nodes.get(dest))
    nodes.get(dest).addConnection(nodes.get(source))
}

let paths = start.getPaths(start, end)
console.log(paths.length)


console.log("\n\n***** PART 2 *****")
paths = start.getPaths(start, end, 1)
console.log(paths.length)