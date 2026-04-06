from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import json
import os
from datetime import datetime

TASK_FILE = os.path.join(os.path.dirname(__file__), "task.json")
LOG_FILE = os.path.join(os.path.dirname(__file__), "task.log")

class Task(BaseModel):
    id: int
    title: str
    description: str = ""
    priority: str  # high, medium, low
    completed: bool = False
    created_at: str = ""
    updated_at: str = ""

def load_tasks() -> List[Task]:
    if not os.path.exists(TASK_FILE):
        return []
    with open(TASK_FILE) as f:
        return [Task(**t) for t in json.load(f)]

def save_tasks(tasks: List[Task]):
    with open(TASK_FILE, "w") as f:
        json.dump([t.dict() for t in tasks], f, indent=2)

def log_action(action: str):
    with open(LOG_FILE, "a") as f:
        f.write(f"{datetime.now().isoformat()} {action}\n")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return load_tasks()

@app.post("/tasks", response_model=Task)
def add_task(task: Task):
    tasks = load_tasks()
    task.id = max([t.id for t in tasks], default=0) + 1
    now = datetime.now().isoformat()
    task.created_at = now
    task.updated_at = now
    tasks.append(task)
    save_tasks(tasks)
    log_action(f"Added task: {task.title} (priority: {task.priority})")
    return task

@app.put("/tasks/{task_id}", response_model=Task)
def edit_task(task_id: int, task: Task):
    tasks = load_tasks()
    for i, t in enumerate(tasks):
        if t.id == task_id:
            task.id = task_id
            task.created_at = t.created_at
            task.updated_at = datetime.now().isoformat()
            tasks[i] = task
            save_tasks(tasks)
            log_action(f"Edited task: {task.title} (priority: {task.priority})")
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    tasks = load_tasks()
    for i, t in enumerate(tasks):
        if t.id == task_id:
            log_action(f"Deleted task: {t.title} (priority: {t.priority})")
            del tasks[i]
            save_tasks(tasks)
            return {"ok": True}
    raise HTTPException(status_code=404, detail="Task not found")

@app.post("/tasks/{task_id}/complete")
def complete_task(task_id: int):
    tasks = load_tasks()
    for t in tasks:
        if t.id == task_id:
            t.completed = True
            t.updated_at = datetime.now().isoformat()
            save_tasks(tasks)
            log_action(f"Completed task: {t.title} (priority: {t.priority})")
            return {"ok": True}
    raise HTTPException(status_code=404, detail="Task not found")
