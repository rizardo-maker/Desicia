"""Resource integrity and installer guardrail tests; no network/browser required."""
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('design_skills', ROOT / 'tools/design_skills.py')
skills = importlib.util.module_from_spec(spec)
spec.loader.exec_module(skills)


class ResourceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.folder = self.root / '.agents/skills/test-skill'
        self.folder.mkdir(parents=True)
        (self.folder / 'SKILL.md').write_text('test skill\n')
        self.manifest = {'sources': [{'copies': [{'destination': '.agents/skills/test-skill'}]}]}
        self.lock = {
            'manifest_sha256': hashlib.sha256(json.dumps(self.manifest, sort_keys=True).encode()).hexdigest(),
            'files': skills.inventory(self.root, self.manifest),
        }

    def test_clean_inventory(self):
        self.assertEqual(skills.verify(self.root, self.manifest, self.lock), 1)

    def test_modified_file_is_detected(self):
        (self.folder / 'SKILL.md').write_text('modified')
        with self.assertRaisesRegex(ValueError, 'modified'):
            skills.verify(self.root, self.manifest, self.lock)

    def test_extra_file_is_detected(self):
        (self.folder / 'unexpected.md').write_text('extra')
        with self.assertRaisesRegex(ValueError, 'unexpected.md'):
            skills.verify(self.root, self.manifest, self.lock)

    def test_missing_file_is_detected(self):
        (self.folder / 'SKILL.md').unlink()
        with self.assertRaisesRegex(ValueError, 'SKILL.md'):
            skills.verify(self.root, self.manifest, self.lock)

    def test_manifest_change_requires_review(self):
        self.manifest['changed'] = True
        with self.assertRaisesRegex(ValueError, 'manifest changed'):
            skills.verify(self.root, self.manifest, self.lock)

    def test_unsafe_destinations_rejected(self):
        for path in ['../outside', '/tmp/outside', '.git/config', '.agents/skills/../../outside', 'README.md']:
            with self.subTest(path=path), self.assertRaises(ValueError):
                skills.safe_destination(self.root, path)

    def test_symlink_escape_rejected(self):
        (self.root / 'third_party').symlink_to(self.root.parent, target_is_directory=True)
        with self.assertRaisesRegex(ValueError, 'escapes'):
            skills.safe_destination(self.root, 'third_party/escaped')

    def test_resource_links_rejected(self):
        (self.folder / 'alias').symlink_to(self.folder / 'SKILL.md')
        with self.assertRaisesRegex(ValueError, 'Symlink'):
            skills.inventory(self.root, self.manifest)

    def test_repository_integrity(self):
        manifest = json.loads((ROOT / 'tools/design-sources.json').read_text())
        lock = json.loads((ROOT / 'tools/design-skills.lock.json').read_text())
        self.assertGreater(skills.verify(ROOT, manifest, lock), 1000)

    @unittest.skipUnless(shutil.which('node'), 'Node is needed for the Taste smoke test')
    def test_taste_copy_linter_executes(self):
        fixture = self.root / 'smoke.html'
        fixture.write_text('<!doctype html><html lang="en"><head><title>Pipe repair for workshops</title>'
                           '</head><body><h1>Pipe repair for workshops</h1>'
                           '<p>Send a photograph of the damaged pipe.</p>'
                           '<a href="mailto:work@example.test">Request a repair quote</a></body></html>')
        result = subprocess.run(['node', str(ROOT / '.agents/skills/design-taste-frontend/scripts/copy-lint.mjs'),
                                 str(fixture), '--kind', 'service', '--json', '--year', '2026'],
                                text=True, capture_output=True, timeout=20)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn('files', json.loads(result.stdout))

    def test_installed_skill_contracts(self):
        manifest = json.loads((ROOT / 'tools/design-sources.json').read_text())
        folders = [ROOT / item['destination'] for source in manifest['sources'] for item in source['copies']
                   if item['destination'].startswith('.agents/skills/')]
        self.assertEqual(len(folders), 20)
        for folder in folders:
            with self.subTest(skill=folder.name):
                body = (folder / 'SKILL.md').read_text()
                self.assertTrue(body.startswith('---\n'))
                frontmatter = body.split('---', 2)[1]
                self.assertIn('name:', frontmatter)
                self.assertIn('description:', frontmatter)
        for script in ['scripts/gate.mjs', 'scripts/consistency.mjs', 'scripts/copy-lint.mjs',
                       'scripts/perf.mjs', 'scripts/shoot.mjs', 'assets/layout/check.mjs']:
            self.assertTrue((ROOT / '.agents/skills/design-taste-frontend' / script).is_file())


if __name__ == '__main__':
    unittest.main()
