import csv
from os import listdir

files = listdir("./")

for file in files:
    if ".csv" in file:
        with open(file, newline='') as read_csvfile:
            with open(file[5:], 'w', newline='') as write_csvfile:
                fieldnames = ['Champion', 'Picks', 'Bans', 'Total']
                rows = csv.DictReader(read_csvfile)
                writer = csv.DictWriter(write_csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for row in rows:
                    new_row = {}
                    new_row['Champion'] = row['Champion']
                    new_row['Picks'] = int(row['Picks'])
                    new_row['Bans'] = int(row['Bans'])
                    new_row['Total'] = int(row['Total'])
                    writer.writerow(new_row)
                