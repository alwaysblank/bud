import type {Framework} from '@roots/bud-framework'

import {ensureDirSync, pathExistsSync} from './run.dependencies'

export interface run {
  (this: Framework): void
}

/**
 * Run the build
 *
 * @example
 * ```js
 * bud.run()
 * ```
 *
 * @public @config
 */
export const run: run = function (): void {
  !pathExistsSync(this.path('storage')) &&
    ensureDirSync(this.path('storage'))

  this.dashboard.run()

  const isDev =
    this.isDevelopment &&
    this.server?.run &&
    this.server?.config.isTrue('middleware.hot')

  const dev = () => {
    this.server?.inject()
    this.server?.run()
  }

  const prod = () => {
    this.compiler.compile().run(this.compiler.callback)
  }

  this.when(isDev, dev, prod)
}
