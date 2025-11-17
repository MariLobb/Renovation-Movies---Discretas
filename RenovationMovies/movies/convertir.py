import csv
import json

with open("ratings.csv", encoding="utf-8") as csv_file:
    reader = csv.DictReader(csv_file)
    data = list(reader)

with open("ratings.json", "w", encoding="utf-8") as json_file:
    json.dump(data, json_file, indent=4, ensure_ascii=False)

print("Archivo JSON creado con éxito.")