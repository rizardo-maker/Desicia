#!/usr/bin/env python3
"""Pinned, repo-local design resources. Standard-library only; never runs upstream installers."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'tools/design-sources.json'
LOCK = ROOT / 'tools/design-skills.lock.json'


def run(*args):
    return subprocess.check_output(args, text=True).strip()


def safe_destination(root, relative):
    path = Path(relative)
    if path.is_absolute() or '..' in path.parts or not path.parts:
        raise ValueError(f'Unsafe destination: {relative}')
    allowed = ('.agents/skills/', 'third_party/')
    if not relative.startswith(allowed):
        raise ValueError(f'Destination outside resource folders: {relative}')
    result = root / path
    if not result.resolve().is_relative_to(root.resolve()):
        raise ValueError(f'Destination escapes repository: {relative}')
    return result


def files_at(path):
    if path.is_symlink():
        raise ValueError(f'Symlink not allowed in resource bundle: {path}')
    if path.is_file():
        return [path]
    if not path.is_dir():
        raise ValueError(f'Missing resource: {path}')
    files = []
    for p in sorted(path.rglob('*')):
        if p.is_symlink():
            raise ValueError(f'Symlink not allowed in resource bundle: {p}')
        if p.is_file():
            files.append(p)
    return files


def inventory(root, manifest):
    files = {}
    for source in manifest['sources']:
        for item in source['copies']:
            for p in files_at(safe_destination(root, item['destination'])):
                files[p.relative_to(root).as_posix()] = hashlib.sha256(p.read_bytes()).hexdigest()
    return dict(sorted(files.items()))


def verify(root, manifest, lock):
    manifest_digest = hashlib.sha256(json.dumps(manifest, sort_keys=True).encode()).hexdigest()
    if lock['manifest_sha256'] != manifest_digest:
        raise ValueError('Source manifest changed; review it and reinstall to regenerate the lock.')
    actual = inventory(root, manifest)
    expected = lock['files']
    changes = [p for p in sorted(actual.keys() | expected.keys()) if actual.get(p) != expected.get(p)]
    if changes:
        raise ValueError('Missing, extra or modified vendored files:\n' + '\n'.join(changes[:30]))
    return len(actual)


def checkout(source):
    if not re.fullmatch(r'[0-9a-f]{40}', source['commit']):
        raise ValueError('Only full Git commit hashes are accepted')
    if not re.fullmatch(r'https://github.com/[\w.-]+/[\w.-]+\.git', source['repository']):
        raise ValueError('Only explicit HTTPS GitHub sources are accepted')
    if not re.fullmatch(r'[a-z0-9-]+', source['id']):
        raise ValueError('Unsafe source id')
    cache = ROOT / '.cache/design-upstreams' / source['id']
    if not cache.exists():
        subprocess.run(['git', 'clone', '--filter=blob:none', '--no-checkout', source['repository'], str(cache)], check=True)
    if run('git', '-C', str(cache), 'remote', 'get-url', 'origin') != source['repository']:
        raise ValueError(f'Unexpected remote in {cache}')
    # Export the pinned Git objects, not potentially edited working-tree files.
    try:
        run('git', '-C', str(cache), 'cat-file', '-e', source['commit'] + '^{commit}')
    except subprocess.CalledProcessError:
        subprocess.run(['git', '-C', str(cache), 'fetch', '--depth=1', 'origin', source['commit']], check=True)
    return cache


def install(manifest):
    import tarfile
    import tempfile
    # Stage and validate everything before touching any installed resource.
    with tempfile.TemporaryDirectory(prefix='desicia-skills-') as temp:
        stage = Path(temp)
        for source in manifest['sources']:
            cache = checkout(source)
            for i, item in enumerate(source['copies']):
                source_path = Path(item['source'])
                if source_path.is_absolute() or '..' in source_path.parts:
                    raise ValueError('Unsafe source path')
                archive = stage / 'source.tar'
                with archive.open('wb') as out:
                    subprocess.run(['git', '-C', str(cache), 'archive', source['commit'], item['source']], stdout=out, check=True)
                unpack = stage / f"{source['id']}-{i}"
                with tarfile.open(archive) as tar:
                    for member in tar:
                        target = unpack / member.name
                        if not target.resolve().is_relative_to(unpack.resolve()):
                            raise ValueError('Archive path escapes staging directory')
                        if member.isdir():
                            target.mkdir(parents=True, exist_ok=True)
                        elif member.isfile():
                            target.parent.mkdir(parents=True, exist_ok=True)
                            with tar.extractfile(member) as data, target.open('wb') as output:
                                shutil.copyfileobj(data, output)
                            target.chmod(member.mode & 0o777)
                        else:
                            raise ValueError(f'Unsupported archive entry: {member.name}')
                src = unpack / item['source']
                dest = safe_destination(stage, item['destination'])
                files_at(src)  # Reject links, including ones within directories.
                dest.parent.mkdir(parents=True, exist_ok=True)
                if src.is_dir():
                    shutil.copytree(src, dest)
                else:
                    shutil.copy2(src, dest)
        hashes = inventory(stage, manifest)
        # Never silently overwrite edits or prune installed directories.
        for rel, digest in hashes.items():
            dest = safe_destination(ROOT, rel)
            if dest.exists() and (not dest.is_file() or hashlib.sha256(dest.read_bytes()).hexdigest() != digest):
                raise ValueError(f'Refusing to overwrite a different file: {rel}. Back it up/remove it explicitly first.')
        for rel in hashes:
            dest = safe_destination(ROOT, rel)
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(stage / rel, dest)
        LOCK.write_text(json.dumps({'manifest_sha256': hashlib.sha256(json.dumps(manifest, sort_keys=True).encode()).hexdigest(), 'files': hashes}, indent=2) + '\n')
    print(f'Installed {len(hashes)} pinned files; no global settings or runtime hooks changed.')


def doctor():
    node = shutil.which('node')
    version = run(node, '--version') if node else 'missing'
    node_ok = bool(re.match(r'v(2[2-9]|[3-9]\d)\.', version))
    browser = os.environ.get('CHROME_PATH') or next((shutil.which(n) for n in ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable', 'microsoft-edge'] if shutil.which(n)), None)
    print(f"{'OK' if node_ok else 'WARN'} Taste requires Node 22+: {version}")
    if browser and Path(browser).is_file():
        print(f'OK Chrome/Chromium executable: {browser}')
    elif (ROOT / 'node_modules/@sparticuz/chromium/package.json').exists():
        print('OK npm Chromium package installed; tools/browser-runtime.mjs prepares it for the Linux audit runner.')
    else:
        print('WARN Browser runtime missing; run npm ci or set CHROME_PATH.')
    print('INFO Open Design resources are installed; its full app is separate (requires Node 24 + pnpm 10.33.2).')
    print('INFO Resource verification is not a page audit. See docs/AUDIT.md for actual browser results and release blockers.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['install', 'verify', 'doctor'])
    args = parser.parse_args()
    manifest = json.loads(MANIFEST.read_text())
    if args.command == 'install':
        install(manifest)
    else:
        count = verify(ROOT, manifest, json.loads(LOCK.read_text()))
        print(f'OK {count} vendored files match the pinned source lock.')
        if args.command == 'doctor':
            doctor()


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f'ERROR {error}', file=sys.stderr)
        sys.exit(1)
