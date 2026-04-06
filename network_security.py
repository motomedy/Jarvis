"""
JARVIS Network Security Agent

Performs network security checks (open ports, services, firewall) and logs results.
Intended to run in the background, triggered by sleep mode (to be integrated later).
"""
import os
import subprocess
from datetime import datetime
from pathlib import Path

LOG_FILE = Path("network_security.log")


def check_open_ports():
    try:
        result = subprocess.run(["lsof", "-i", "-P", "-n"], capture_output=True, text=True)
        output = result.stdout if result.returncode == 0 else "lsof failed."
        # Analyze for risky open ports (not on allowlist)
        allowlist = {"22", "443", "80", "5173", "8340"}  # Add your known/needed ports here
        risky_ports = set()
        for line in output.splitlines():
            if "LISTEN" in line:
                parts = line.split()
                for p in parts:
                    if ":" in p:
                        port = p.split(":")[-1]
                        if port.isdigit() and port not in allowlist:
                            risky_ports.add(port)
        if risky_ports:
            output += f"\n[!] Risk: Unrecognized open ports detected: {', '.join(sorted(risky_ports))}. Consider closing these if not needed."
        return output
    except Exception as e:
        return f"Error running lsof: {e}"

def check_firewall():
    try:
        result = subprocess.run(["/usr/libexec/ApplicationFirewall/socketfilterfw", "--getglobalstate"], capture_output=True, text=True)
        status = result.stdout.strip() if result.returncode == 0 else "Firewall check failed."
        if "disabled" in status.lower():
            status += "\n[!] Risk: Firewall is disabled. Enable it for better protection."
        return status
    except Exception as e:
        return f"Error checking firewall: {e}"

def check_recent_connections():
    try:
        result = subprocess.run(["netstat", "-an"], capture_output=True, text=True)
        output = result.stdout if result.returncode == 0 else "netstat failed."
        # Look for suspicious external connections (not localhost or 127.0.0.1)
        suspicious = []
        for line in output.splitlines():
            if "ESTABLISHED" in line and not ("127.0.0.1" in line or "localhost" in line):
                suspicious.append(line)
        if suspicious:
            output += f"\n[!] Risk: Suspicious established connections detected (not localhost):\n" + "\n".join(suspicious)
            output += "\nReview these connections for unknown remote IPs."
        return output
    except Exception as e:
        return f"Error running netstat: {e}"

def log_security_report():
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a") as f:
        f.write(f"\n--- Network Security Report: {now} ---\n")
        open_ports = check_open_ports()
        firewall = check_firewall()
        connections = check_recent_connections()
        f.write("\n[Open Ports]\n" + open_ports)
        f.write("\n[Firewall Status]\n" + firewall)
        f.write("\n[Recent Connections]\n" + connections)
        # Summarize risks
        risks = []
        if "[!] Risk" in open_ports:
            risks.append("Open ports not on allowlist.")
        if "[!] Risk" in firewall:
            risks.append("Firewall is disabled.")
        if "[!] Risk" in connections:
            risks.append("Suspicious external connections.")
        if risks:
            f.write("\n[Summary of Risks]\n" + "\n".join(risks) + "\n")
            f.write("\n[Suggestions]\n- Close unnecessary ports\n- Enable firewall\n- Investigate unknown connections\n")
        else:
            f.write("\nNo immediate risks detected. Network appears safe.\n")
        f.write("\n--- End of Report ---\n")
    print(f"Network security report logged to {LOG_FILE}")

def main():
    log_security_report()

if __name__ == "__main__":
    main()
