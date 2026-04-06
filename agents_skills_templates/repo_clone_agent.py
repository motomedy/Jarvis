"""
Repo Clone Agent Template
- Clones a Git repository to a specified directory
- Handles errors and logs results
- Usage: clone_repo('https://github.com/user/repo.git', '/desired/path')
"""
import subprocess
import os
import logging

def clone_repo(repo_url, dest_path=None):
    if not repo_url:
        logging.error("No repository URL provided.")
        return False
    if dest_path is None:
        dest_path = os.path.basename(repo_url.rstrip('/')).replace('.git', '')
    try:
        if os.path.exists(dest_path):
            logging.warning(f"Destination path '{dest_path}' already exists.")
            return False
        cmd = ["git", "clone", repo_url, dest_path]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode == 0:
            logging.info(f"Successfully cloned {repo_url} to {dest_path}")
            register_repo_path(dest_path)
            print_setup_instructions(dest_path)
            return True
        else:
            logging.error(f"Git clone failed: {result.stderr}")
            return False
    except Exception as e:
        logging.error(f"Exception during git clone: {e}")
        return False

def print_setup_instructions(repo_path):
    """Print setup instructions from INSTALL.md or README.md if present."""
    candidates = [
        os.path.join(repo_path, "INSTALL.md"),
        os.path.join(repo_path, "README.md"),
        os.path.join(repo_path, ".opencode", "INSTALL.md"),
        os.path.join(repo_path, ".codex", "INSTALL.md"),
    ]
    for file in candidates:
        if os.path.exists(file):
            print(f"\n--- Setup instructions from {file} ---\n")
            try:
                with open(file, "r") as f:
                    print(f.read(2000))
            except Exception as e:
                print(f"Could not read {file}: {e}")
            print("\n--- End of setup instructions ---\n")
            return
    print("No INSTALL.md or README.md found for setup instructions.")

def register_repo_path(path):
    """Register the repo path for JARVIS to access later (writes to a known file)."""
    try:
        with open(".jarvis_repos", "a") as f:
            f.write(f"{os.path.abspath(path)}\n")
        logging.info(f"Registered repo path: {os.path.abspath(path)}")
    except Exception as e:
        logging.error(f"Failed to register repo path: {e}")


if __name__ == "__main__":
    # Test cloning the provided repo link and register for JARVIS
    test_url = "https://github.com/ruvnet/ruflo.git"
    print(f"Cloning {test_url} ...")
    success = clone_repo(test_url)
    if success:
        print("Clone successful and registered for JARVIS access!")
    else:
        print("Clone failed. Check logs for details.")
