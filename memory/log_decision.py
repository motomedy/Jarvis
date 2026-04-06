#!/usr/bin/env python3
import csv
import sys
import datetime
import os

decision_file = os.path.join(os.path.dirname(__file__), "decisions.csv")

def log_decision(decision, reasoning, expected_outcome):
    today = datetime.date.today().isoformat()
    review_date = (datetime.date.today() + datetime.timedelta(days=30)).isoformat()
    with open(decision_file, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([today, decision, reasoning, expected_outcome, review_date, "pending"])

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: log_decision.py <decision> <reasoning> <expected_outcome>")
        sys.exit(1)
    log_decision(sys.argv[1], sys.argv[2], sys.argv[3])
