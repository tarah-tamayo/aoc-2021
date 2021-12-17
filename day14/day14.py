import json

rules = {}
with open("input") as f:
    polymer = f.readline().strip()
    f.readline() # blank line
    lines = f.read().split("\n")
for line in lines:
    [a, _, b] = line.split()
    rules[a] = b
print(polymer)

pairs = {}
for key in rules.keys():
    pairs[key] = [0, 0]
for i in range(0, len(polymer) - 1):
    pair = polymer[i] + polymer[i+1]
    pairs[pair][0] += 1

for step in range(1, 41):
    for pair in pairs.keys():
        count = pairs[pair][0] ## 2x SP + 2x F --> 2x SFP
        rule = rules[pair] # == F
        pairs[pair[0]+rule][1] += count
        pairs[rule + pair[1]][1] += count
    for val in pairs.values():
        val[0] = val[1]
        val[1] = 0
largest = 0
smallest = 0
molecules = {}
for pair in pairs.keys():
    count = pairs[pair][0]
    if pair[0] not in molecules.keys():
        molecules[pair[0]] = 0
    if pair[1] not in molecules.keys():
        molecules[pair[1]] = 0
    molecules[pair[0]] += count
    molecules[pair[1]] += count
molecules[polymer[0]] += 1 # All molecules are counted twice except the 1st and last.
molecules[polymer[-1]] += 1
print(molecules)
for count in molecules.values():
    if count/2 > largest:  # Divide all by 2 because we count each twice (each is involved in 2 pairs)
        largest = count/2
    if smallest == 0:
        smallest = count/2
    if count/2 < smallest:
        smallest = count/2
print(largest-smallest)