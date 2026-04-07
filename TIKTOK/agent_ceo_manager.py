"""Lightweight CEO agent placeholders for dashboard runtime."""

from __future__ import annotations

from datetime import date


class ExampleAgent:
    name = "example_agent"

    def status(self) -> str:
        return "idle"


class SearchEngineAgent:
    name = "search_engine_agent"

    def status(self) -> str:
        return "monitoring"


class SocialMediaMarketerAgent:
    name = "social_media_marketer_agent"

    def status(self) -> str:
        return "planning"


class CEOAgent:
    def __init__(self) -> None:
        self.status_reports = {"content_agent": "idle", "analytics_agent": "idle"}
        self._content_schedule = []

    def get_timeline(self) -> list[dict]:
        return [
            {
                "date": str(date.today()),
                "event": "Dashboard initialized",
                "status": "ok",
            }
        ]

    def recommend_team(self, project: dict) -> list[str]:
        _ = project
        return ["content_agent", "analytics_agent"]

    def set_content_schedule(self, schedule: list[dict]) -> None:
        self._content_schedule = list(schedule)

    def check_content_deadlines(self) -> dict:
        return {"overdue": [], "upcoming": []}

    def request_status_reports(self, agents: list[object]) -> None:
        for agent in agents:
            name = getattr(agent, "name", agent.__class__.__name__.lower())
            if hasattr(agent, "status"):
                self.status_reports[name] = str(agent.status())
            else:
                self.status_reports[name] = "active"
