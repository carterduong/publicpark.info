import {readdirSync, readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import type {Plugin} from 'vite'

const MODULES: Record<string, () => Promise<string>> = {
  'virtual:tailwind-breakpoints': async () =>
    `export const tailwindBreakpoints = ${JSON.stringify(await readThemeBreakpoints())};`,
  'virtual:tailwind-spacing': async () =>
    `export const tailwindSpacing = ${JSON.stringify(await readThemeSpacing())};`,
}

const srcDir = fileURLToPath(new URL('../../', import.meta.url))
const stylesDir = path.join(srcDir, 'styles')
const stylesEntry = path.join(srcDir, 'styles.css')

type DesignSystem = {
  theme: {
    namespace(name: string): Map<string | null, string> | undefined
  }
}

type TailwindBreakpointsModule = {
  __unstable__loadDesignSystem: (css: string, options: {base: string}) => Promise<DesignSystem>
}

export function tailwindBreakpointsPlugin(): Plugin {
  return {
    name: 'tailwind-breakpoints',
    resolveId(id) {
      if (id in MODULES) return `\0${id}`
    },
    async load(id) {
      const virtualId = id.startsWith('\0') ? id.slice(1) : null
      const render = virtualId ? MODULES[virtualId] : undefined
      if (!render) return

      this.addWatchFile(stylesEntry)
      for (const file of readdirSync(stylesDir)) {
        if (file.endsWith('.css')) this.addWatchFile(path.join(stylesDir, file))
      }

      return render()
    },
  }
}

async function readThemeNamespace(name: string) {
  const require = createRequire(import.meta.resolve('@tailwindcss/vite'))
  const entry = pathToFileURL(require.resolve('@tailwindcss/node')).href
  const loaded = (await import(entry)) as TailwindBreakpointsModule
  const design = await loaded.__unstable__loadDesignSystem(readFileSync(stylesEntry, 'utf8'), {
    base: srcDir,
  })

  const theme = design.theme.namespace(name)
  if (!theme) {
    throw new Error(`Tailwind did not return a ${name} theme from src/styles.css.`)
  }
  return theme
}

async function readThemeBreakpoints() {
  const theme = await readThemeNamespace('--breakpoint')
  return [...theme.entries()].map(([name, minWidth]) => ({
    name,
    minWidth: String(minWidth).trim(),
  }))
}

/** Named spacing tokens only. The `null` key is Tailwind's base `--spacing` unit. */
async function readThemeSpacing() {
  const theme = await readThemeNamespace('--spacing')
  return [...theme.entries()].flatMap(([name, value]) =>
    name === null ? [] : [{name, value: String(value).trim()}],
  )
}
