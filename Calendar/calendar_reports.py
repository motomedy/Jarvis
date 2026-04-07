from datetime import datetime
import json
import os
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


EVENTS_FILE = os.path.join(os.path.dirname(__file__), "events.json")
TASKS_FILE = os.path.join(os.path.dirname(__file__), "tasks.json")
REPORTS_FILE = os.path.join(os.path.dirname(__file__), "reports.json")


class Event(BaseModel):
    id: int
    title: str
    description: str
    start: str
    end: str
    all_day: bool


class Task(BaseModel):
    id: int
    title: str
    description: str
    due: Optional[str]
    status: str


class Report(BaseModel):
    id: int
    project: str
    manager: str
    team: List[str]
    summary: str
    created_at: str
    updated_at: str


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_events() -> List[Event]:
    if not os.path.exists(EVENTS_FILE):
        return []
    with open(EVENTS_FILE) as f:
        return [Event(**e) for e in json.load(f)]


def save_events(events: List[Event]):
    with open(EVENTS_FILE, "w") as f:
        json.dump([e.dict() for e in events], f, indent=2)


def load_tasks() -> List[Task]:
    if not os.path.exists(TASKS_FILE):
        return []
    with open(TASKS_FILE) as f:
        return [Task(**t) for t in json.load(f)]


def save_tasks(tasks: List[Task]):
    with open(TASKS_FILE, "w") as f:
        json.dump([t.dict() for t in tasks], f, indent=2)


def load_reports() -> List[Report]:
    if not os.path.exists(REPORTS_FILE):
        return []
    with open(REPORTS_FILE) as f:
        return [Report(**r) for r in json.load(f)]


def save_reports(reports: List[Report]):
    with open(REPORTS_FILE, "w") as f:
        json.dump([r.dict() for r in reports], f, indent=2)


@app.get("/api/events", response_model=List[Event])
def get_events():
    return load_events()


@app.post("/api/events", response_model=Event)
def add_event(event: Event):
    events = load_events()
    event.id = max([e.id for e in events], default=0) + 1
    events.append(event)
    save_events(events)
    return event


@app.put("/api/events/{event_id}", response_model=Event)
def edit_event(event_id: int, event: Event):
    events = load_events()
    for i, existing in enumerate(events):
        if existing.id == event_id:
            event.id = event_id
            events[i] = event
            save_events(events)
            return event
    raise HTTPException(status_code=404, detail="Event not found")


@app.get("/api/tasks", response_model=List[Task])
def get_tasks():
    return load_tasks()


@app.post("/api/tasks", response_model=Task)
def add_task(task: Task):
    tasks = load_tasks()
    task.id = max([t.id for t in tasks], default=0) + 1
    tasks.append(task)
    save_tasks(tasks)
    return task


@app.put("/api/tasks/{task_id}", response_model=Task)
def edit_task(task_id: int, task: Task):
    tasks = load_tasks()
    for i, existing in enumerate(tasks):
        if existing.id == task_id:
            task.id = task_id
            tasks[i] = task
            save_tasks(tasks)
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.get("/api/reports", response_model=List[Report])
def get_reports():
    return load_reports()


@app.post("/api/reports", response_model=Report)
def add_report(report: Report):
    reports = load_reports()
    report.id = max([r.id for r in reports], default=0) + 1
    now = datetime.now().isoformat()
    report.created_at = now
    report.updated_at = now
    reports.append(report)
    save_reports(reports)
    return report


@app.put("/api/reports/{report_id}", response_model=Report)
def edit_report(report_id: int, report: Report):
    reports = load_reports()
    for i, existing in enumerate(reports):
        if existing.id == report_id:
            report.id = report_id
            report.created_at = existing.created_at
            report.updated_at = datetime.now().isoformat()
            reports[i] = report
            save_reports(reports)
            return report
    raise HTTPException(status_code=404, detail="Report not found")


@app.get("/api/reports/search", response_model=List[Report])
def search_reports(q: Optional[str] = None):
    reports = load_reports()
    if not q:
        return reports
    query = q.lower()
    return [
        r
        for r in reports
        if query in r.project.lower() or query in r.manager.lower() or query in r.summary.lower()
    ]
