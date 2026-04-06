"""
Agent: SideHustleExpert
Purpose: Suggest realistic, low-cost, quick-launch side hustles.
"""

def suggest_side_hustles():
    return [
        "Print-on-Demand Products: Use free platforms like Redbubble or Teespring to sell custom designs. No inventory needed.",
        "Freelance Microservices: Offer writing, design, or data entry on Fiverr/Upwork. Startup cost: $0–$20 for premium tools.",
        "Local Errand/Task Service: Offer grocery runs, pet sitting, or yard work in your area. Startup: $10–$30 for flyers.",
        "Digital Product Sales: Create and sell digital planners or templates on Etsy. Startup: $0–$30 for listing fees.",
        "Online Tutoring or Coaching: Tutor or coach via Zoom. Startup: $0–$20 for marketing materials."
    ]

if __name__ == "__main__":
    for hustle in suggest_side_hustles():
        print(hustle)
