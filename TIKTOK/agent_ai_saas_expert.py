"""
Agent: AiSaasExpert
Purpose: Suggest simple, no-code, AI-powered subscription business ideas.
"""

def suggest_ai_saas_ideas():
    return [
        "AI Content/Caption Generator Subscription: Use no-code tools to deliver social media captions or posts on a subscription basis.",
        "AI-Powered Personalized Newsletter: Curate and summarize news or trends using AI, delivered via email subscription.",
        "AI Image/Design Prompt Service: Use AI tools to create custom images or graphics for subscribers."
    ]

if __name__ == "__main__":
    for idea in suggest_ai_saas_ideas():
        print(idea)
