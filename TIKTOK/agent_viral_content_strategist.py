"""
Agent: ViralContentStrategist
Purpose: Generate viral video ideas, scripts, and captions for the Jarvis niche.
"""

def get_viral_ideas():
    return [
        {
            "title": "Day in the Life with Jarvis: AI Does My Tasks!",
            "script": "Ever wish you had an assistant for everything?... [see full script above]",
            "caption": "Letting AI run my day—would you trust Jarvis with your to-do list? 🤖☕ #AIassistant #ProductivityHacks #JarvisChallenge"
        },
        {
            "title": "3 AI Hacks You Didn’t Know You Needed",
            "script": "3 AI Hacks for Busy People... [see full script above]",
            "caption": "These Jarvis hacks will save you HOURS every week! Which one will you try first? ⏳🤖 #AIhacks #LifeSimplified #JarvisTips"
        },
        {
            "title": "How I Built My Own AI Assistant (And You Can Too!)",
            "script": "I built my own AI assistant—here’s how you can too!... [see full script above]",
            "caption": "DIY your own AI assistant in minutes! Comment ‘JARVIS’ for the full guide. 🚀 #AIAutomation #BuildWithMe #JarvisAI"
        },
        {
            "title": "AI vs. Human: Who’s Faster?",
            "script": "Can I beat my AI assistant at my own job?... [see full script above]",
            "caption": "AI: 1, Me: 0. Who do you think won? 😅🤖 #AIvsHuman #ProductivityBattle #JarvisChallenge"
        },
        {
            "title": "What If Tony Stark’s Jarvis Was Real?",
            "script": "What if Tony Stark’s Jarvis was real?... [see full script above]",
            "caption": "Tony Stark would be jealous. Ready for your own Jarvis? 🚀🤖 #IronMan #RealLifeJarvis #FutureIsNow"
        }
    ]

if __name__ == "__main__":
    for idea in get_viral_ideas():
        print(f"Title: {idea['title']}\nScript: {idea['script']}\nCaption: {idea['caption']}\n")
