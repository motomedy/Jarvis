"""
Agent: CEOOrchestrator
Purpose: Act as CEO, distribute tasks to agents, track progress, and organize content/videos.
"""
import json
import os

CONTENT_PLAN_FILE = '30_day_content_plan.md'
VIDEO_LOG_FILE = 'created_videos.json'

# Simulate agent task distribution and tracking
class CEOOrchestrator:
    def __init__(self):
        self.tasks = []
        self.completed = []
        self.load_video_log()

    def load_video_log(self):
        if os.path.exists(VIDEO_LOG_FILE):
            with open(VIDEO_LOG_FILE, 'r') as f:
                self.video_log = json.load(f)
        else:
            self.video_log = []

    def save_video_log(self):
        with open(VIDEO_LOG_FILE, 'w') as f:
            json.dump(self.video_log, f, indent=2)

    def distribute_tasks(self):
        # 1. Niche research (already done)
        # 2. First video creation
        self.tasks.append('Create first video content (VideoIdeasPlanner, VideoCreator)')
        # 3. 30-day content plan
        self.tasks.append('Generate 30-day content plan (VideoIdeasPlanner)')
        # 4. Script/caption writing
        self.tasks.append('Write scripts/captions for each video (ViralContentStrategist)')
        # 5. Track video creation
        self.tasks.append('Track created videos (VideoCreator)')

    def mark_video_created(self, day, title):
        self.video_log.append({'day': day, 'title': title})
        self.save_video_log()
        self.completed.append(f'Video for Day {day}: {title}')

    def get_content_plan(self):
        if os.path.exists(CONTENT_PLAN_FILE):
            with open(CONTENT_PLAN_FILE, 'r') as f:
                return f.read()
        return 'No content plan found.'

    def get_video_log(self):
        return self.video_log

    def get_status(self):
        return {
            'tasks': self.tasks,
            'completed': self.completed,
            'video_log': self.video_log,
            'content_plan': self.get_content_plan()
        }

if __name__ == "__main__":
    ceo = CEOOrchestrator()
    ceo.distribute_tasks()
    # Simulate first video creation
    ceo.mark_video_created(1, "Day in the Life with Jarvis: AI Does My Tasks!")
    status = ceo.get_status()
    print(json.dumps(status, indent=2))
