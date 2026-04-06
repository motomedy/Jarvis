"""
Background Skills/Update Agent Template
- Periodically checks for new skills/scripts/updates (e.g., from a Git repo or API)
- Applies updates as needed
"""
import time
import logging


def check_for_updates(fetch_func, interval=3600, stop_event=None, max_retries=3):
    retries = 0
    while not (stop_event and stop_event.is_set()):
        try:
            updates = fetch_func()
            if updates:
                logging.info("Applied new skills/updates.")
                retries = 0
            else:
                logging.info("No new updates found.")
        except Exception as e:
            logging.error(f"Skills update error: {e}")
            retries += 1
            if retries >= max_retries:
                logging.error("Max retries reached. Exiting updater.")
                break
        time.sleep(interval)
