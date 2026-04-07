class SearchEngineAgent:
    def get_status_report(self):
        return "Optimizing video metadata for search engines and trending topics."

    def suggest_keywords(self, video_title):
        # Placeholder: In real use, integrate with Google Trends/YouTube/TikTok APIs
        return ["AI tools", "productivity hacks", "2026 trends"]

class SocialMediaMarketerAgent:
    def get_status_report(self):
        return "Promoting videos across social platforms and engaging with the audience."

    def schedule_post(self, video_title, platforms=None):
        if platforms is None:
            platforms = ["TikTok", "Instagram", "Twitter"]
        return f"Scheduled '{video_title}' for {', '.join(platforms)}."
import datetime
from projects_data import projects


class CEOAgent:
    def __init__(self):
        self.timeline = []  # List of (date, event, status)
        self.status_reports = {}
        self.last_check = None
        self.content_schedule = []  # List of {title, due_date, status}

    def recommend_team(self, project):
        """Recommend a team of agents based on project type and business plan."""
        team = ["ExampleAgent"]
        if project.get("type") == "Productivity" or "AI" in project.get("niche", ""):
            team.append("SearchEngineAgent")
            team.append("SocialMediaMarketerAgent")
        # Add more logic based on business plan or project details
        return team

    def set_content_schedule(self, schedule):
        """Set the expected content schedule (list of dicts with title, due_date)."""
        self.content_schedule = schedule

    def check_content_deadlines(self):
        """Check for overdue or upcoming content and log events."""
        today = datetime.datetime.now().date()
        overdue = []
        upcoming = []
        for item in self.content_schedule:
            due = datetime.datetime.strptime(item['due_date'], '%Y-%m-%d').date()
            if item.get('status') == 'done':
                continue
            if due < today:
                overdue.append(item)
                self.log_event(f"Content overdue: {item['title']} (was due {item['due_date']})", status="late")
            elif (due - today).days <= 2:
                upcoming.append(item)
                self.log_event(f"Content due soon: {item['title']} (due {item['due_date']})", status="upcoming")
        return {'overdue': overdue, 'upcoming': upcoming}

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
