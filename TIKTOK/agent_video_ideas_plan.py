"""
Agent: VideoIdeasPlanner
Purpose: Generate a 30-day content plan for TikTok video ideas in a specified niche.
"""

def generate_30_day_plan(niche: str) -> list:
    """
    Generate a list of 30 video ideas for the given niche.
    Args:
        niche (str): The content niche (e.g., 'fitness', 'cooking').
    Returns:
        list: 30 video idea strings.
    """
    plan = []
    for day in range(1, 31):
        idea = f"Day {day}: {niche.title()} Video Idea #{day}"
        plan.append(idea)
    return plan

if __name__ == "__main__":
    niche = input("Enter your TikTok niche: ")
    plan = generate_30_day_plan(niche)
    print("\n30-Day TikTok Video Ideas Plan:")
    for idea in plan:
        print(idea)
