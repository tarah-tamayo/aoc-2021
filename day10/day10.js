fs = require('fs')
const input = fs.readFileSync('input', 'utf8').split('\n')

console.log("***** PART 1 *****")
let error_score = 0
let fix_scores = []
for (line of input) {
    let fix_score = 0
    let error = false
    let stack = []
    let test = ""
    for (let c of line) {
        switch (c) {
            case '(':
            case '[':
            case '{':
            case '<':
                stack.push(c)
                break
            case ')':
                test = stack.pop()
                if (test != "(") {
                    error = true
                    error_score += 3
                }
                break
            case ']':
                test = stack.pop()
                if (test != "[") {
                    error = true
                    error_score += 57
                }
                break
            case '}':
                test = stack.pop()
                if (test != "{") {
                    error = true
                    error_score += 1197
                }
                break
            case '>':
                test = stack.pop()
                if (test != "<") {
                    error = true
                    error_score += 25137
                }
                break
        }
        if (error) break
    }
    let fix = ""
    while (stack.length > 0) {
        test = stack.pop()
        fix_score *= 5
        switch (test) {
            case '(':
                fix_score += 1
                fix += ')'
                break
            case '[':
                fix_score += 2
                fix += ']'
                break
            case '{':
                fix_score += 3
                fix += '}'
                break
            case '<':
                fix_score += 4
                fix += '>'
                break
        }
    }
    if (!error) {
        fix_scores.push(fix_score)
        //console.log(`${line} --> ${fix} --> ${fix_score}`)
    } else {
        //console.log(`${line} --> ERROR`)
    }
}
console.log(error_score)


console.log("\n\n***** PART 2 *****")
fix_scores.sort((a,b) => a-b)
let middle = Math.floor(fix_scores.length/2)
console.log(fix_scores[middle])