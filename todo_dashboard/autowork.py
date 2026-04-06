#!/usr/bin/env python3
import json
import os
from datetime import datetime

TASK_FILE = os.path.join(os.path.dirname(__file__), "task.json")
LOG_FILE = os.path.join(os.path.dirname(__file__), "task.log")

PRIORITY_ORDER = {"high": 0, "medium": 1, "low": 2}

def load_tasks():
    if not os.path.exists(TASK_FILE):
        return []
    with open(TASK_FILE) as f:
        return json.load(f)

def save_tasks(tasks):
    with open(TASK_FILE, "w") as f:
        json.dump(tasks, f, indent=2)

def log_action(action):
    with open(LOG_FILE, "a") as f:
        f.write(f"{datetime.now().isoformat()} {action}\n")

def work_through_tasks():
    tasks = load_tasks()
    pending = [t for t in tasks if not t.get("completed")]
    if not pending:
        return
    # Sort by priority, then by created_at
    pending.sort(key=lambda t: (PRIORITY_ORDER.get(t.get("priority","low"), 2), t.get("created_at")))
    task = pending[0]
    # Simulate work
    log_action(f"Started task: {task['title']} (priority: {task['priority']})")
    # Mark as complete
    for t in tasks:
        if t["id"] == task["id"]:
            t["completed"] = True
            t["updated_at"] = datetime.now().isoformat()
            break
    save_tasks(tasks)
    log_action(f"Completed task: {task['title']} (priority: {task['priority']})")

if __name__ == "__main__":
    work_through_tasks()
