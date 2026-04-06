"""
Jarvis Orchestrator: Connects all expert agents and automates the workflow.
"""
import subprocess

AGENTS = {
    'side_hustle': 'agent_side_hustle_expert.py',
    'viral_content': 'agent_viral_content_strategist.py',
    'ai_saas': 'agent_ai_saas_expert.py',
    'email_marketing': 'agent_email_marketing_expert.py',
}

def run_agent(agent_key):
    script = AGENTS.get(agent_key)
    if not script:
        print(f"Unknown agent: {agent_key}")
        return
    result = subprocess.run(['python', script], capture_output=True, text=True)
    print(f"\n--- Output from {script} ---\n{result.stdout}")
    return result.stdout

def automate_workflow():
    print("\n[1] Generating side hustle ideas...")
    side_hustles = run_agent('side_hustle')
    print("\n[2] Generating viral content ideas...")
    viral_content = run_agent('viral_content')
    print("\n[3] Generating AI SaaS business ideas...")
    ai_saas = run_agent('ai_saas')
    print("\n[4] Generating cold email for outreach...")
    email = run_agent('email_marketing')
    print("\nWorkflow complete. All outputs above.")

if __name__ == "__main__":
    automate_workflow()
