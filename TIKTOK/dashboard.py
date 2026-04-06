
from flask import Flask, render_template, request, redirect, url_for, session, send_file, flash, jsonify
"""
A simple local web dashboard for managing video ideas.
Features: Add, edit, delete video ideas. Dark theme UI.
"""

import os
import csv
from io import StringIO

from dashboard_storage import load_ideas, save_ideas
import tiktok_api_integration
from projects_data import projects
from agent_ceo_manager import CEOAgent, ExampleAgent
# CEO agent instance (singleton for demo)
ceo_agent = CEOAgent()


app = Flask(__name__)
app.secret_key = os.environ.get('DASHBOARD_SECRET_KEY', 'change_this_secret')

TIKTOK_REDIRECT_URI = os.environ.get('TIKTOK_REDIRECT_URI', 'http://localhost:5000/tiktok/callback')
TIKTOK_AUTH_STATE = 'tiktok_state_123'


# --- Simple authentication ---
USERNAME = os.environ.get('DASHBOARD_USER', 'admin')
PASSWORD = os.environ.get('DASHBOARD_PASS', 'admin')

def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('logged_in'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

# --- TikTok OAuth Connect ---
@app.route('/tiktok/connect')
@login_required
def tiktok_connect():
    auth_url = tiktok_api_integration.get_auth_url(TIKTOK_REDIRECT_URI, TIKTOK_AUTH_STATE)
    return redirect(auth_url)

# --- TikTok OAuth Callback ---
@app.route('/tiktok/callback')
def tiktok_callback():
    code = request.args.get('code')
    state = request.args.get('state')
    error = request.args.get('error')
    if error:
        flash(f'TikTok connection failed: {error}', 'error')
        return redirect(url_for('index'))
    if not code or state != TIKTOK_AUTH_STATE:
        flash('Invalid TikTok OAuth response.', 'error')
        return redirect(url_for('index'))
    import traceback
    # Exchange code for tokens
    try:
        token_data = tiktok_api_integration.exchange_code_for_token(code, TIKTOK_REDIRECT_URI)
        # Save tokens to environment or a secure store (for demo, flash result)
        if 'access_token' in token_data:
            flash('TikTok account connected successfully!', 'success')
            try:
                with open('tiktok_tokens.json', 'w') as f:
                    import json
                    json.dump(token_data, f, indent=2)
            except Exception as file_err:
                flash(f'Error saving token file: {file_err}', 'error')
                print('Error saving tiktok_tokens.json:', file_err)
                print(traceback.format_exc())
        else:
            flash(f'TikTok connection failed: {token_data}', 'error')
            print('TikTok token exchange failed:', token_data)
        return redirect(url_for('index'))
    except Exception as err:
        flash(f'Exception during TikTok callback: {err}', 'error')
        print('Exception in /tiktok/callback:', err)
        print(traceback.format_exc())
        return redirect(url_for('index'))

# Status endpoint (must be after app is defined)
@app.route('/status')
def status():
    return jsonify({"status": "ok", "message": "Dashboard server is running."})


def get_ideas():
    return load_ideas()

def set_ideas(ideas):
    save_ideas(ideas)


# --- Simple authentication ---
USERNAME = os.environ.get('DASHBOARD_USER', 'admin')
PASSWORD = os.environ.get('DASHBOARD_PASS', 'admin')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] == USERNAME and request.form['password'] == PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('index'))
        else:
            flash('Invalid credentials', 'error')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('logged_in'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated



# Multi-project dashboard route
# Multi-project dashboard route
@app.route('/')
@login_required
def index():
    project_id = request.args.get('project', projects[0]['id'])
    project = next((p for p in projects if p['id'] == project_id), projects[0])

    # Example: update metrics dynamically for AI Productivity
    if project['id'] == 'ai_productivity':
        video_ideas = get_ideas()
        try:
            import json
            if os.path.exists('created_videos.json'):
                with open('created_videos.json', 'r') as f:
                    video_log = json.load(f)
            else:
                video_log = []
        except Exception:
            video_log = []
        project['metrics']['ideas'] = len(video_ideas)
        project['metrics']['videos'] = len(video_log)
        import datetime
        project['metrics']['last_updated'] = datetime.datetime.now().strftime('%Y-%m-%d')
    else:
        video_ideas = []
        video_log = []

    # CEO status/timeline for dashboard
    ceo_timeline = ceo_agent.get_timeline()
    ceo_status_reports = ceo_agent.status_reports if hasattr(ceo_agent, 'status_reports') else {}

    return render_template(
        'dashboard.html',
        projects=projects,
        current_project=project,
        video_ideas=video_ideas,
        video_log=video_log,
        ceo_timeline=ceo_timeline,
        ceo_status_reports=ceo_status_reports
    )

# Route to trigger CEO agent status check
@app.route('/ceo/status_check')
@login_required
def ceo_status_check():
    # In a real system, pass all real agent instances
    agents = [ExampleAgent()]
    ceo_agent.request_status_reports(agents)
    return redirect(url_for('index'))


@app.route('/add', methods=['POST'])
@login_required
def add_idea():
    idea = request.form.get('idea')
    video_ideas = get_ideas()
    if idea:
        video_ideas.append(idea)
        set_ideas(video_ideas)
    return redirect(url_for('index'))


@app.route('/edit/<int:idx>', methods=['POST'])
@login_required
def edit_idea(idx):
    new_idea = request.form.get('idea')
    video_ideas = get_ideas()
    if 0 <= idx < len(video_ideas) and new_idea:
        video_ideas[idx] = new_idea
        set_ideas(video_ideas)
    return redirect(url_for('index'))


@app.route('/delete/<int:idx>', methods=['POST'])
@login_required
def delete_idea(idx):
    video_ideas = get_ideas()
    if 0 <= idx < len(video_ideas):
        video_ideas.pop(idx)
        set_ideas(video_ideas)
    return redirect(url_for('index'))

# --- Export to CSV ---
@app.route('/export/csv')
@login_required
def export_csv():
    video_ideas = get_ideas()
    si = StringIO()
    writer = csv.writer(si)
    writer.writerow(['Day', 'Video Idea'])
    for idx, idea in enumerate(video_ideas, 1):
        writer.writerow([idx, idea])
    si.seek(0)
    return send_file(
        StringIO(si.read()),
        mimetype='text/csv',
        as_attachment=True,
        download_name='video_ideas.csv'
    )


if __name__ == '__main__':
    app.run(debug=True, port=5001)
