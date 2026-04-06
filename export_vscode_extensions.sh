#!/bin/bash
# Export all installed VS Code extensions
echo "Exporting installed extensions to vscode-extensions.txt..."
code --list-extensions > vscode-extensions.txt
echo "Done."

echo "To install these extensions in a new workspace, run:"
echo "cat vscode-extensions.txt | xargs -L 1 code --install-extension"
