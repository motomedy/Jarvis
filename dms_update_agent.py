"""
Agent: dms_update_agent.py

Automates:
- Monitoring Apple Mail for update instructions from dms.apec.com.jo
- Connecting to dms.apec.com.jo (SSH/SFTP/API)
- Applying updates as specified in email
- Logging actions/results
- Can be scheduled or run in background
"""

import asyncio
import os
import logging
from datetime import datetime
from mail_access import get_unread_messages, read_message
# import paramiko or requests as needed for remote connection

logging.basicConfig(filename="dms_update_agent.log", level=logging.INFO)

DMS_HOST = os.getenv("DMS_HOST", "dms.apec.com.jo")
DMS_USER = os.getenv("DMS_USER", "")
DMS_PASS = os.getenv("DMS_PASS", "")

UPDATE_KEYWORDS = ["dms", "apec", "update", "deploy"]

async def monitor_email_and_update():
    messages = await get_unread_messages(20)
    for msg in messages:
        if any(k in msg["subject"].lower() for k in UPDATE_KEYWORDS) or DMS_HOST in msg["subject"] or DMS_HOST in msg["preview"]:
            logging.info(f"[{datetime.now()}] Found update email: {msg['subject']}")
            full = await read_message(msg["subject"])
            if full:
                instructions = full["content"]
                # TODO: parse instructions and trigger update
                logging.info(f"Instructions: {instructions[:200]}")
                # Example: connect_and_update(instructions)
            else:
                logging.warning(f"Could not read full message for: {msg['subject']}")

if __name__ == "__main__":
    asyncio.run(monitor_email_and_update())
