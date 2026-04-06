#!/usr/bin/env python3
import csv
import datetime
import os

decision_file = os.path.join(os.path.dirname(__file__), "decisions.csv")
today = datetime.date.today().isoformat()
rows = []
updated = False

if not os.path.exists(decision_file):
    exit(0)

with open(decision_file, newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Only flag if not already flagged
        if row["status"].strip() != "review due" and row["review_date"] <= today:
            row["status"] = "review due"
            updated = True
        rows.append(row)

if updated:
    with open(decision_file, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["date","decision","reasoning","expected_outcome","review_date","status"])
        writer.writeheader()
        writer.writerows(rows)
