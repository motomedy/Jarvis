"""
Remote Connection Agent Template
- Connects to remote servers via SSH/SFTP or API
- Uses paramiko for SSH/SFTP, requests for API
"""
import paramiko
import requests
import logging


def ssh_connect_and_run(host, user, password=None, key_path=None, command="echo ok", timeout=10):
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        if key_path:
            client.connect(host, username=user, key_filename=key_path, timeout=timeout)
        else:
            client.connect(host, username=user, password=password, timeout=timeout)
        stdin, stdout, stderr = client.exec_command(command, timeout=timeout)
        output = stdout.read().decode()
        err = stderr.read().decode()
        client.close()
        if err:
            logging.warning(f"SSH stderr: {err}")
        return output
    except Exception as e:
        logging.error(f"SSH error: {e}")
        return None


def api_post(url, data, headers=None, timeout=10):
    try:
        resp = requests.post(url, json=data, headers=headers, timeout=timeout)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logging.error(f"API error: {e}")
        return None
