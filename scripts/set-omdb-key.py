#!/usr/bin/env python3
"""Enter the server credential privately from an interactive terminal."""
from getpass import getpass
from pathlib import Path
import os
import re
import tempfile

def main():
    try:
        key = getpass('Paste your new OMDb key (characters hidden), then press Return: ').strip()
    except (KeyboardInterrupt, EOFError):
        print('\nCancelled. Configuration unchanged.')
        return
    if not re.fullmatch(r'[A-Za-z0-9_-]{4,128}', key):
        print('The key was empty or contained unexpected characters. Configuration unchanged.')
        return
    root = Path(__file__).resolve().parent.parent
    destination = root / '.env.local'
    existing = destination.read_text() if destination.exists() else ''
    lines = [line for line in existing.splitlines() if not re.match(r'^\s*OMDB_API_KEY\s*=', line)]
    lines.append('OMDB_API_KEY=' + key)
    descriptor, temporary = tempfile.mkstemp(prefix='.env-setup-', dir=root)
    try:
        with os.fdopen(descriptor, 'w') as handle:
            handle.write('\n'.join(lines) + '\n')
        os.chmod(temporary, 0o600)
        os.replace(temporary, destination)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)
    print('Key saved privately. It was not displayed. The preview needs restarting.')

if __name__ == '__main__':
    main()
