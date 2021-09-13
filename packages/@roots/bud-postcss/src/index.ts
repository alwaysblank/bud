// Copyright (c) Roots Foundation, LLC. All rights reserved.
// Licensed under the MIT license.

/**
 * Adds PostCSS support to Bud

 * @see https://roots.io/bud
 * @see https://github.com/roots/bud
 *
 * @remarks
 * - 💁 Composable - Build boss web applications with a modular, configurable build system
 *
 * - 💪 Modern - Modern framework that scales from a single file to thousands of lines of code
 *
 * - 🌱 Easy - Low bundle size and fast build times

 * @extension @packageDocumentation @betaDocumentation
 */

declare module '@roots/bud-framework' {
  interface Framework {
    /**
     * Configure postcss plugins and plugin options.
     */
    postcss: PostCssConfig
  }

  interface Modules {
    '@roots/bud-postcss': BudPostCssExtension
  }

  interface Loaders {
    postcss: Loader
  }

  interface Items {
    postcss: Item
  }
}

import type {Item, Loader} from '@roots/bud-build'

import {BudPostCssExtension} from './BudPostCssExtension'
import {PostCssConfig} from './PostCssConfig'

export const {name, api, boot} = BudPostCssExtension
export {PostCssConfig}
export type {BudPostCssExtension}
