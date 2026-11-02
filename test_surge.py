import subprocess

p = subprocess.Popen(
    ['npx.cmd', '--yes', 'surge', 'dist', '--domain', 'goksel-finans-takip.surge.sh'],
    cwd=r'C:\Users\GOKSEL\.gemini\antigravity\scratch\finans-takip',
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

stdout, stderr = p.communicate(input='mehemtgoksel23@gmail.com\nFinansTakip2026!\n', timeout=20)
print('STDOUT:', stdout)
print('STDERR:', stderr)
