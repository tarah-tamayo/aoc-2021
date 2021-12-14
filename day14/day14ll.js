/* Fails out of memory (8Gb RAM EC2 Instance) during step 25 */

fs = require('fs')
let input = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")
class Node {
    constructor(element) {
        this.element = element
        this.next = null
    }

    insertAfter(node) {
        if (this.next != null) {
            let next = this.next
            this.next = node
            node.next = next
        } else this.next = node
    }
}

let template = input.shift()
input.shift() // blank line follows template
let pair_rules = new Map()
for (line of input) {
    let [rule, insertion] = line.split(' -> ')
    pair_rules.set(rule, insertion)
}

// Set up LL from template
let start = null
let current = null
for (element of template) {
    let e = new Node(element)
    if (start == null) {
        start = e
        current = start
    } else {
        current.insertAfter(e)
        current = current.next
    }
}

// Cycle to step 10
for (let step = 1; step <= 10; step++) {
    current = start
    let i = 1
    while (current.next != null) {
        i++
        let pair = current.element + current.next.element
        if (pair_rules.has(pair)) {
            let e = new Node(pair_rules.get(pair))
            current.insertAfter(e)
            current = current.next
            i++
        }
        current = current.next
    }
    console.log(`Step #${step}: ${i}`)
}

let count = new Map()
current = start
while (current != null) {
    if (count.has(current.element)) {
        count.set(current.element, count.get(current.element)+1)
    } else count.set(current.element, 1)
    current = current.next
}
let max = 0
let min = Infinity
for (c of count.values()) {
    if (c > max) max = c
    if (c < min) min = c
}
console.log(max-min)


console.log("\n\n***** PART 2 *****")

for (let step = 11; step <= 40; step++) {
    current = start
    let i = 1
    while (current.next != null) {
        i++
        let pair = current.element + current.next.element
        if (pair_rules.has(pair)) {
            let e = new Node(pair_rules.get(pair))
            current.insertAfter(e)
            current = current.next
            i++
        }
        current = current.next
    }
    console.log(`Step #${step}: ${i}`)
}

count.clear()
current = start
while (current != null) {
    if (count.has(current.element)) {
        count.set(current.element, count.get(current.element)+1)
    } else count.set(current.element, 1)
    current = current+next
}
max = 0
min = Infinity
for (c of count.values()) {
    if (c > max) max = c
    if (c < min) min = c
}
console.log(max-min)