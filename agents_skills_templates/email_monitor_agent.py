"""
Email Monitoring Agent Template
- Monitors Apple Mail for relevant update instructions (read-only)
- Can be adapted for other email sources
"""
import asyncio
from mail_access import get_unread_messages, read_message
import logging

async def monitor_email(keywords, process_func, max_count=20, sender_filter=None):
    try:
        messages = await get_unread_messages(max_count)
        for msg in messages:
            if any(k in msg["subject"].lower() for k in keywords):
                if sender_filter and sender_filter not in msg["sender"]:
                    continue
                try:
                    full = await read_message(msg["subject"])
                    if full:
                        await process_func(full)
                    else:
                        logging.warning(f"Could not read full message for: {msg['subject']}")
                except Exception as e:
                    logging.error(f"Error processing message: {e}")
    except Exception as e:
        logging.error(f"Mail access error: {e}")

# Usage: pass a function to process_func that handles the message content

# Usage: pass a function to process_func that handles the message content
