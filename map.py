import json
import csv
print("hello")
with open('data/hero_usage_data/2014_champion.csv', newline='') as file:
    rows = csv.reader(file)
    team = set()
    for row in rows:
        team.add(row[0])
    
    print("result:", sorted(list(team)))