import {resolve, sep as slash} from 'node:path'

import {Bud, Locations} from '..'

/**
 * Transform `@alias` path
 *
 * @param app - Bud instance
 * @param base - Path segment
 * @returns string
 *
 * @public
 */
export interface parseAlias {
  (
    app: Bud,
    base:
      | `${keyof Locations & string}`
      | `${keyof Locations & string}/${string}`,
  ): string
}

export const parseAlias: parseAlias = (app, base) => {
  /* Normalize base path to an array of path segments */
  let [ident, ...parts] = base.includes(slash) ? base.split(slash) : [base]

  /* If there is no match for ident there is a problem */
  !app.hooks.has(`location.${ident}`) &&
    app.error(
      `\`${ident}\` is not a registered path. It must be defined with bud.setPath`,
    )

  /* Replace base path */
  ident = app.hooks.filter(`location.${ident}`)

  /* If segments were passed, resolve */
  return parts.length ? resolve(ident, ...parts) : ident
}

/**
 * Transform `@alias` path
 *
 * @param app - Bud instance
 * @param base - Path segment
 * @returns string
 *
 * @public
 */
export interface path {
  (
    base?:
      | `${keyof Locations & string}`
      | `@file`
      | `@name`
      | `${keyof Locations & string}/${string}`
      | `./${string}`
      | `/${string}`,
    ...segments: Array<string>
  ): string
}
export const path: path = function (base, ...segments) {
  const app = this as Bud

  /* Exit early with projectDir if no path was passed */
  if (!base) return app.context.projectDir

  const fileHandles = (pathString: string) =>
    pathString
      .replace(
        '@file',
        app.store.is('features.hash', true)
          ? '[path][name].[contenthash:6][ext]'
          : '[path][name][ext]',
      )
      .replace(
        '@name',
        app.store.is('features.hash', true)
          ? '[name].[contenthash:6][ext]'
          : '[name][ext]',
      )

  if (base === '@file' || base === '@name') return fileHandles(base)
  base = fileHandles(base)
  segments = segments.map(fileHandles)

  /* Parse `@` aliases. Should return an absolute path */
  if (base.startsWith(`@`)) base = parseAlias(app, base as `@${string}`)

  /* Resolve any base path that isn't already absolute */
  if (!base.startsWith(`/`)) base = resolve(app.context.projectDir, base)

  /* If segments were passed, resolve them against base */
  return segments.length ? resolve(base, ...segments) : base
}
