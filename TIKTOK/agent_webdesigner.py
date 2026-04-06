"""
Agent: WebDesigner
Purpose: Upgrade dashboard style for a professional, business-worthy look.
"""

def get_professional_css():
    return '''
    :root {
        --bg-main: #181a1b;
        --bg-card: #23272e;
        --bg-accent: #20232a;
        --primary: #4f8cff;
        --primary-hover: #2563eb;
        --text-main: #f4f6fa;
        --text-muted: #a1a1aa;
        --border-radius: 16px;
        --shadow: 0 6px 32px #000a;
        --transition: 0.18s cubic-bezier(.4,0,.2,1);
    }
    html, body {
        height: 100%;
    }
    body {
        min-height: 100vh;
        background: var(--bg-main);
        color: var(--text-main);
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
    }
    .container {
        max-width: 820px;
        margin: 56px auto 32px auto;
        background: var(--bg-card);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        padding: 48px 40px 40px 40px;
    }
    h1 {
        text-align: center;
        margin-bottom: 36px;
        color: var(--primary);
        font-size: 2.5rem;
        letter-spacing: 1.2px;
        font-weight: 700;
    }
    h2 {
        color: var(--primary);
        font-size: 1.5rem;
        margin-bottom: 18px;
        font-weight: 600;
    }
    form {
        display: flex;
        gap: 12px;
        margin-bottom: 28px;
    }
    input[type="text"] {
        flex: 1;
        padding: 14px 16px;
        border: none;
        border-radius: 8px;
        background: var(--bg-accent);
        color: var(--text-main);
        font-size: 1.08rem;
        outline: none;
        transition: box-shadow var(--transition);
    }
    input[type="text"]:focus {
        box-shadow: 0 0 0 2px var(--primary);
    }
    button {
        background: var(--primary);
        color: var(--bg-main);
        border: none;
        border-radius: 8px;
        padding: 14px 24px;
        cursor: pointer;
        font-weight: 700;
        font-size: 1.08rem;
        transition: background var(--transition), color var(--transition);
        box-shadow: 0 2px 8px #0002;
    }
    button:hover {
        background: var(--primary-hover);
        color: #fff;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0 0 28px 0;
    }
    li {
        background: var(--bg-accent);
        margin-bottom: 14px;
        border-radius: 8px;
        padding: 14px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 10px #0002;
    }
    .edit-form {
        display: flex;
        gap: 10px;
    }
    .edit-input {
        padding: 10px 12px;
        border-radius: 7px;
        border: none;
        background: var(--bg-main);
        color: var(--text-main);
        font-size: 1.08rem;
    }
    .edit-input:focus {
        box-shadow: 0 0 0 2px var(--primary);
    }
    hr {
        border: none;
        border-top: 2px solid #333;
        margin: 48px 0 36px 0;
    }
    .dashboard-section {
        background: var(--bg-card);
        border-radius: var(--border-radius);
        padding: 40px 28px;
        margin-top: 36px;
        box-shadow: 0 2px 16px #0002;
    }
    .dashboard-section h2 {
        color: var(--primary);
        text-align: center;
        font-size: 1.5rem;
        margin-bottom: 28px;
        letter-spacing: 0.7px;
    }
    .dashboard-section strong {
        color: var(--primary);
    }
    .dashboard-section pre {
        background: var(--bg-main);
        color: var(--text-main);
        padding: 16px;
        border-radius: 8px;
        font-size: 1.05rem;
        margin-bottom: 22px;
        overflow-x: auto;
        font-family: 'JetBrains Mono', 'Fira Mono', 'Menlo', monospace;
    }
    .tab-content {
        animation: fadeIn 0.4s;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @media (max-width: 900px) {
        .container {
            max-width: 99vw;
            padding: 18px 2vw 18px 2vw;
        }
        .dashboard-section {
            padding: 18px 2vw;
        }
    }
    '''

if __name__ == "__main__":
    print(get_professional_css())
