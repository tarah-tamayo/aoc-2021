fs = require('fs')
let input = fs.readFileSync('sample', 'utf8')

function hex2bin(hex) {
    /*
    Takes one hex digit and returns the binary string. The string always has 4 digits
    */
    let bin = parseInt(hex, 16).toString(2)
    while (bin.length < 4) {
        bin = "0" + bin
    }
    return bin
}

function bin2dec(bin) {
    return parseInt(bin, 2).toString()
}

class Packet {
    constructor(version, type) {
        this.packets = []
        this.version = version
        this.type = type
        this.contents = ""
        this.value = null
        this.hexStore = null
        this.opType = -1
    }

    setHexStore(hexStore) {
        this.hexStore = hexStore
    }

    setContents(bits) {
        /*
        Sets the packet contents. This is for Operator type packets only
        */
        this.contents = bits
    }

    setValue(value) {
        /*
        Sets the integer value of the packet. This is for Literal type packets only
        */
       this.value = value
    }

    setOpType(opType) {
        /*
        Sets the operator packet type
        */
       this.opType = opType
    }

    toString() {
        if (this.type == 4) 
            return `V: ${this.version} T: ${this.type} V: ${this.value}`
        return `V: ${this.version} T: ${this.type} C: ${this.contents}`
    }
}

class HexStore {
    constructor(hex) {
        this.hex = hex.split('').reverse()
        this.used = []
    }

    nextHex() {
        if (this.length() > 0) {
            let val = this.hex.pop()
            console.log(`You want a hex?! Here: ${val} = ${hex2bin(val)}`)
            this.used.push(val)
            return val
        } else return null
    }

    length() {
        return this.hex.length
    }
}

class UnderwaterMessageParser {
    constructor(hex) {
        this.hex = new HexStore(hex)
        this.used = []
        this.remaining = ""
        this.packets = []
        this.versionSum = 0 // This is our main output!
    }

    getPackets() { return this.packets }

    parseVersion(rem="", store=this.hex) {
        /* 
         * Gets the Version and Type of the packet
         *
         * Inputs:
         *     rem   [String]: String of bits (base 2 parseable integer) to prepend
         *   store [Function]: Function to provide more hex digits as needed
         * 
         * Returns:
         *     [Array]:
         *         [0]: (Integer) Version
         *         [1]: (Integer) Type
         *         [2]: (String) String of bits left over after processing
        */
        if (store === null)
            store = this.hex
        let bin = rem
        while (bin.length < 6) {
            bin += hex2bin(store.nextHex())
        }
        let ver = parseInt(bin.substring(0,3), 2)
        let type = parseInt(bin.substring(3,6), 2)
        let remaining = ""
        if (bin.length > 6)
            remaining = bin.substring(6)
        return [ver, type, remaining]
    }

    parseLiteral(rem="", store=this.hex) {
        /*
         * For packets with Type = 4 (0b100), retrieve and combine the literal values. Return as int.
         *
         * Inputs:
         *     rem   [String]: String of bits (base 2 parseable integer) to prepend
         *   store [Function]: Function to provide more hex digits as needed
         * 
         * Returns:
         *     [Array]:
         *         [0]: (Integer) Value stored in this packet
         *         [1]: (String) String of bits left over after processing. This may be zeros padded into
         *              hex digits, but will be used for some message types.
        */
        if (store === null)
            store = this.hex
        let bin = rem
        let literal = ""
        while (bin.length < 5) bin += hex2bin(store.nextHex())
        while (bin[0] === "1") {
            while (bin.length < 5) bin += hex2bin(store.nextHex())
            let bits = bin.substring(1, 5)
            console.log(`--> parseLiteral :: Literally got a bit of ${bits}`)
            bin = bin.substring(5)
            literal += bits
        }
        while (bin.length < 5) bin += hex2bin(store.nextHex())
        console.log(`--> parseLiteral :: Literally got a bit of ${bin.substring(1, 5)}`)
        literal += bin.substring(1, 5)
        let remaining = bin.substring(5)
        literal = parseInt(literal, 2)
        console.log(`--> parseLiteral :: Joined 'em all up to get a ${literal}`)
        return [literal, remaining]
    }

    parseOperator(rem="", store=this.hex) {
        /*
         * For packets with Type != 4, figure out the length and either return the bits indicated
         * by the bit length OR return the number of packets contained within this operator.
         * 
         * Inputs:
         *     rem   [String]: String of bits (base 2 parseable integer) to prepend
         *   store [Function]: Function to provide more hex digits as needed
         * 
         * Returns:
         *     [Array]:
         *         [0]: (String) One character, either "1" or "0" to indicate the operator storage
         *              type. Type "0": Length in Bits
         *                    Type "1": Length in Packets
         *         [1]: (Varies) Type "0": Return the bits inside this operator packet
         *                       Type "1": Return the number of packets to parse as part of this packet
         *         [2]: (String) String of bits left over after processing. This will be empty for Type "1"
        */
        if (store === null)
            store = this.hex
        let bin = rem
        if (bin.length == 0) bin += hex2bin(store.nextHex())
        let opType = bin[0]
        console.log(`--> parseOperator :: Found out this is a Type ${opType}! Neat!!!`)
        let length = 0
        switch (opType) {
            case "1":
               length = 11
               break
            case "0":
                length = 15
                break
        }
        let index = 1
        while (bin.length < length + index)
            bin += hex2bin(store.nextHex())
        console.log(`--> parseOperator :: Got a bunch of stuff in ${bin} - Remember ${bin[0]} is the opType`)
        let opLen = parseInt(bin.substring(index, index + length), 2)
        console.log(`--> parseOperator :: ${opLen}?! That's pretty long...`)
        console.log(`--> parseOperator :: Operator contains length ${opLen} [${bin.substring(index, index+length)}] type ${opType}`)
        index += length
        let remaining = ""
        let bits = null
        switch (opType) {
            case "1":
                bits = opLen
                remaining = bin.substring(index)
                break
            case "0":
                console.log(`--> parseOperator :: Bitlength is ${opLen}`)
                if (opLen % 4 != 0)
                    opLen += 4 - opLen % 4
                console.log(`--> parseOperator :: But we need ${opLen}`)
                console.log(`--> parseOperator :: We have bin length ${bin.length} and index ${index}`)
                while (bin.length < index + opLen) bin += hex2bin(store.nextHex())
                bits = bin.substring(index, index+opLen)
                console.log(`--> parseOperator :: Looks like I'm storing a bunch of ${bits}`)
                //while (bits.length % 4 != 0) bits += "0"
                let lead = ""
                while (bits.substring(0,4) == "0000") {
                    bits = bits.substring(4)
                    lead += "0" // hex
                }
                bits = lead + parseInt(bits, 2).toString(16)
                console.log(`--> parseOperator :: You could possibly call that ${bits}`)
                index += opLen
                remaining = bin.substring(index)
                console.log(`--> parseOperator :: Do I even need what's left over? ${remaining}`)
                break
        }
        return [opType, bits, remaining]
    }

    parsePackets() {
        /*
         * Parse all packets in the input Hex store. (Creates new Hex Stores as needed).
         *
         * No inputs or returns. Updates object variables
        */
        // Keep track of packets that belong to operators:
        let packetCountdowns = [] // Stack
        let packetCountdown = 0
        let opPackets = [] // Stack
        let opPacket = null
        let hexStores = [] // Stack
        let store = this.hex
        let mem = "" // remember previous packet's remainder
        while ((this.hex.length() > 2) || (store.length() > 2)) {
            let [ver, type, rem] = this.parseVersion(mem, store)
            this.versionSum += ver
            console.log(`<<< parsePackets >>> :: Packet Countdown Party!!!!! ${packetCountdown}`)
            console.log(`<<< parsePackets >>> :: VERSION UPDATE!!!!! ${this.versionSum}`)
            console.log(`~.~.~.~.~.~... "${mem}" Packet Header Read ${ver} ${type} "${rem}"`)
            let packet = new Packet(ver, type)
            switch (type) {
                case 4: // Literal Type
                    let literal = this.parseLiteral(rem, store)
                    packet.setValue(literal[0])
                    mem = literal[1]
                    break
                default: // Operator Type
                    let operator = this.parseOperator(rem, store)
                    packetCountdown-- // Decrement for the packet we just processed
                    if (operator[0] === "1") {
                        // Length in Packets
                        packet.setOpType(operator[0])
                        if (packetCountdown > 0) {
                            packetCountdowns.push(packetCountdown)
                            opPackets.push(opPacket)
                        }
                        // no *new* HexStore for Packet operators - use whatever was in use before. We still push so we can pop later
                        hexStores.push(store)
                        packetCountdown = operator[1] + 1 // One more - we'll decrement at the end of this loop
                    } else {
                        // Length in Bytes
                        packet.setOpType(operator[0])
                        packet.setHexStore(new HexStore(operator[1]))
                        if (packetCountdown > 0) {
                            packetCountdowns.push(packetCountdown)
                            opPackets.push(opPacket)
                        }
                        hexStores.push(store)
                        packetCountdown = Infinity // We care about bytes for this one!
                        store = packet.hexStore
                    }
                    opPacket = packet
                    mem = operator[2] // Need to remember this!
                    break
            }
            this.packets.push(packet)
            console.log(packet.toString())
            if (packetCountdown > 0) {
                packetCountdown--
            }
            console.log(`<<< parsePackets >>> :: Looks like we have ${store.length()} nibbles left and ${packetCountdown} op packets left. Ooh, there are ${hexStores.length} bit stores left.`)
            while (((packetCountdown === 0) || (store.length() < 2)) && (hexStores.length > 0)) {
                // pop if any are available
                if (opPackets.length > 0) {
                    opPacket = opPackets.pop()
                    console.log(`<<< parsePackets >>> :: Popped a packet!`)
                }
                if (packetCountdowns.length > 0) {
                    packetCountdown = packetCountdowns.pop()
                    console.log(`<<< parsePackets >>> :: Popped a packet Countdown!`)
                }
                if (hexStores.length > 0) {
                    store = hexStores.pop();
                    console.log(`<<< parsePackets >>> :: Popped a hexStore!`)
                    console.log(`<<< ParsePackets >>> :: Ok, there are now ${store.length()} nibbles. Phew?`)
                } else store = this.hex
            } 
            console.log(`<<< parsePackets >>> :: Packet Countdown Party's over :'( ${packetCountdown}`)
            if ((store === this.hex) && (packetCountdown === 0)) {
                console.log(`<<< parsePackets >>> :: Tossing out the "${mem}"`)
                mem = ""
                if (store.length() < 2) {
                    store.nextHex()
                }
            }
            if ((packetCountdown == Infinity) && (parseInt(mem) == 0)) {
                console.log(`<<< parsePackets >>> :: Tossing out the "${mem}"`)
                mem = ""
            }
        }
    }
}

console.log("***** PART 1 *****")
let parser = new UnderwaterMessageParser(input)
parser.parsePackets()
let packets = parser.getPackets()
for (let packet of packets) console.log(packet.toString())
console.log(parser.versionSum)