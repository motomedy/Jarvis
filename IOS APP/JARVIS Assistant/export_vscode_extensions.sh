#!/bin/bash
# Export all installed VS Code extensions to a file
code --list-extensions > vscode-extensions.txt

echo "VS Code extensions have been exported to vscode-extensions.txt"