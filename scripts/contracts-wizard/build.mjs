// Builds the Kaia Contracts Wizard and places the static output in outDir
// (public/contracts-wizard by default), so Vite serves it in dev and copies it
// into dist on build.
//
// Settings come from config.json and can be overridden per run:
//   WIZARD_REPO     git URL of the wizard repository
//   WIZARD_REF      commit SHA, tag or branch to build (e.g. "main")
//   WIZARD_OUT_DIR  output directory, relative to the project root
//
// Upstream ships no lockfile, so yarn.lock here pins the dependencies for
// config.json's ref and is installed with --frozen-lockfile. Any other ref
// resolves dependencies fresh. After changing the ref in config.json, run
//   yarn build:wizard --update-lockfile
// to regenerate yarn.lock. The built commit is recorded in version.json.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '../..')
const config = JSON.parse(
  fs.readFileSync(path.join(scriptDir, 'config.json'), 'utf8')
)

// Empty env values (e.g. an unset GitHub Actions variable) fall back to config
const setting = (envName, configValue) => process.env[envName] || configValue

const repo = setting('WIZARD_REPO', config.repo)
const ref = setting('WIZARD_REF', config.ref)
const outDir = path.resolve(projectRoot, setting('WIZARD_OUT_DIR', config.outDir))
const lockfile = path.join(scriptDir, 'yarn.lock')
const updateLockfile = process.argv.includes('--update-lockfile')
const usesPinnedRef = repo === config.repo && ref === config.ref

if (updateLockfile && !usesPinnedRef) {
  throw new Error('--update-lockfile only applies to the ref in config.json')
}
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'contracts-wizard-'))

const run = (cmd, args, cwd = workDir) =>
  execFileSync(cmd, args, { cwd, stdio: 'inherit' })

const edit = (file, transform) => {
  const content = fs.readFileSync(file, 'utf8')
  const next = transform(content)
  if (next === content) throw new Error(`Patch had no effect: ${file}`)
  fs.writeFileSync(file, next)
}

try {
  run('git', ['init', '-q'])
  run('git', ['fetch', '-q', '--depth', '1', repo, ref])
  run('git', ['checkout', '-q', 'FETCH_HEAD'])
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: workDir })
    .toString()
    .trim()
  console.log(`Building Contracts Wizard ${repo} @ ${ref} (${commit})`)

  const frozen = usesPinnedRef && !updateLockfile
  if (frozen) {
    fs.copyFileSync(lockfile, path.join(workDir, 'yarn.lock'))
  } else if (!updateLockfile) {
    console.warn('Ref differs from config.json; resolving dependencies fresh')
  }

  const ui = path.join(workDir, 'packages/ui')

  // embed.js resolves embed.html against the site origin, which breaks when
  // the wizard is served from a subpath. Resolve it next to build/ instead.
  edit(path.join(ui, 'src/embed.ts'), (s) =>
    s.replace(
      "new URL('embed.html', currentScript.origin)",
      "new URL('../embed.html', currentScript)"
    )
  )

  for (const page of ['index.html', 'embed.html']) {
    edit(path.join(ui, 'public', page), (s) =>
      s
        // Drop third-party trackers/widgets inherited from the OpenZeppelin
        // fork (GTM, GA, OptinMonster, HubSpot) and the Netlify-only form.
        .replace(/[ \t]*<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->\n?/, '')
        .replace(/[ \t]*<!-- Global site tag[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>\n?/, '')
        .replace(/[ \t]*<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\n?/, '')
        .replace(/[ \t]*<!-- Hidden form necessary for Netlify Forms -->[\s\S]*?<\/form>\n?/, '')
        .replace(/[ \t]*<!-- This site is converting[\s\S]*?<!-- \/ OptinMonster -->\n?/, '')
        .replace(/[ \t]*<!-- Start of HubSpot[\s\S]*?<!-- End of HubSpot Embed Code -->\n?/, '')
        // Root-absolute asset paths -> relative, so the subpath works.
        .replace(/((?:href|src|content)=['"])\/(?!\/)/g, '$1')
    )
  }
  edit(path.join(ui, 'public/standalone.css'), (s) =>
    s.replace(/url\((['"]?)\/(?!\/)/g, 'url($1')
  )

  run('yarn', [
    'install',
    '--non-interactive',
    ...(frozen ? ['--frozen-lockfile'] : []),
  ])
  if (updateLockfile) {
    fs.copyFileSync(path.join(workDir, 'yarn.lock'), lockfile)
    console.log(`Updated ${path.relative(process.cwd(), lockfile)}`)
  }
  run('yarn', ['--cwd', 'packages/ui', 'build'])

  fs.rmSync(outDir, { recursive: true, force: true })
  fs.cpSync(path.join(ui, 'public'), outDir, {
    recursive: true,
    filter: (src) => !src.endsWith('.map'),
  })
  // Record what was deployed, e.g. /contracts-wizard/version.json
  fs.writeFileSync(
    path.join(outDir, 'version.json'),
    JSON.stringify({ repo, ref, commit }, null, 2) + '\n'
  )
  console.log(`Contracts Wizard built into ${path.relative(process.cwd(), outDir)}`)
} finally {
  fs.rmSync(workDir, { recursive: true, force: true })
}
