import json
import csv
with open('data/players.csv', newline='') as file:
    rows = csv.reader(file)

    for row in rows:
        row[""]