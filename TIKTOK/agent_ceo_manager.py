import datetime
from projects_data import projects

class CEOAgent:
    def __init__(self):
        self.timeline = []  # List of (date, event, status)
        self.status_reports = {}
        self.last_check = None

    def log_event(self, event, status="pending"):
        self.timeline.append({
            "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            "event": event,
            "status": status
        })

    def request_status_reports(self, agents):
        self.status_reports = {}
        for agent in agents:
            try:
                report = agent.get_status_report()
            except Exception as e:
                report = f"Error: {e}"
            self.status_reports[agent.__class__.__name__] = report
        self.last_check = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        self.log_event("Requested status reports from all agents", status="done")
        return self.status_reports

    def check_production_deadlines(self, project_id, expected_finish):
        today = datetime.datetime.now().date()
        if today > expected_finish:
            self.log_event(f"Project {project_id} missed deadline!", status="late")
            return False
        else:
            self.log_event(f"Project {project_id} on track for deadline.", status="on time")
            return True

    def get_timeline(self):
        return self.timeline

# Example agent interface for status reporting
class ExampleAgent:
    def get_status_report(self):
        return "All systems operational."

# Usage example:
# ceo = CEOAgent()
# ceo.request_status_reports([ExampleAgent()])
# ceo.check_production_deadlines("ai_productivity", datetime.date(2026, 4, 30))
# print(ceo.get_timeline())
