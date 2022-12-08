import json
import csv
with open('data/2022_team.csv', newline='') as file:
    rows = csv.reader(file)
    team = set()
    for row in rows:
        team.add(row[2])
    print(sorted(list(team)))