fs = require('fs')
let bingo_event = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")

class Card {
    card = []
    marked = []
    bingo = false

    constructor(lines) {
        for (line of lines) {
            const splitline = line.trim().split(/ +/)
            this.card.push(splitline.map(x => parseInt(x)))
            this.marked.push(Array(splitline.length).fill(-1))
        }
    }

    score() {
        let total = 0
        for (line of this.card) {
            let val = 0
            for (val of line) {
                if (val != "") total += val
            }
        }
        return total
    }

    mark(call) {
        for (let i = 0; i < this.card.length; i++) {
            line = this.card[i]
            for (let j = 0; j < line.length; j++) {
                if (this.card[i][j] === call) {
                    this.marked[i][j] = this.card[i][j]
                    this.card[i][j] = ""
                }
            }
        }
    }

    #checkDiagonals() {
        let neg_main = 0
        let neg_back = 0
        for (let i = 0; i < this.marked.length; i++) {
            if (this.marked[i][i] < 0) neg_main++
            if (this.marked[this.marked.length - i - 1][i] < 0) neg_back++
        }
        if (neg_main === 0) return true
        if (neg_back === 0) return true
        return false
    }

    #checkHorizontals() {
        for (line of this.marked) {
            if (line.every((val) => val >= 0)) return true
        }
        return false
    }

    #checkVerticals() {
        for (let j = 0; j < this.marked.length; j++) {
            let negs = 0
            for (let i = 0; i < this.marked.length; i++) {
                if (this.marked[i][j] < 0) negs++
            }
            if (negs === 0) return true
        }
        return false
    }

    check() {
        if (/*this.#checkDiagonals()||*/this.#checkHorizontals()||this.#checkVerticals()) {
            this.bingo = true
            return true
        }
        return false
    }

    reset() {
        this.bingo = false
        for (let i = 0; i < this.card.length; i++) {
            for (let j = 0; j < this.card.length; j++) {
                if (this.marked[i][j] != -1) {
                    this.card[i][j] = this.marked[i][j]
                    this.marked[i][j] = -1
                }
            }
        }
    }
}

let line = bingo_event.shift()
let call_line = ""
while (line != "") {
    call_line += line
    line = bingo_event.shift()
}
called = call_line.split(",").map(x => parseInt(x))

let cards = []
while (bingo_event.length > 0) {
    line = bingo_event.shift()
    let lines = []
    while (line != "") {
        lines.push(line)
        line = bingo_event.shift()
    }
    cards.push(new Card(lines))
}

let bingo = []
let i = 0
while (bingo.length == 0) {
    console.log(`Calling #${called[i]}`)
    for (card of cards) {
        card.mark(called[i])
        if (card.check()) bingo.push(card)
    }
    i++
}
for (winner of bingo) {
    const score = winner.score()
    console.log("Winning Card:\n")
    console.log(winner.card)
    console.log("----------")
    console.log(winner.marked)
    console.log("----------")
    console.log(`Score = ${score}`)
    console.log(`Answer = ${score * called[i-1]}`)
}

console.log("\n\n***** PART 2 *****")
bingo = []
for (card of cards) card.reset()
i = 0
let done = false
while ((cards.length > 1) || (!done)) {
    console.log(`Calling #${called[i]} with ${cards.length} cards and ${bingo.length} winners.`)
    for (let j = cards.length - 1; j >= 0; j--) {
        cards[j].mark(called[i])
        if (cards[j].check()) {
            if (cards.length == 1) done = true; else {
                bingo.push(card)
                cards.splice(j, 1)
            }
        }
    }
    i++
}
for (loser of cards) {
    const score = loser.score()
    console.log("Losing Card:\n")
    console.log(loser.card)
    console.log("----------")
    console.log(loser.marked)
    console.log("----------")
    console.log(`Score = ${score}`)
    console.log(`Answer = ${score * called[i-1]}`)
}