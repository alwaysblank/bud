// Copyright (c) Roots Foundation, LLC. All rights reserved.
// Licensed under the MIT license.

/**
 * Add React to Bud
 *
 * @see https://roots.io/bud
 * @see https://github.com/roots/sage
 *
 * @remarks
 * - 💁 Composable - Build boss web applications with a modular, configurable build system
 *
 * - 💪 Modern - Modern framework that scales from a single file to thousands of lines of code
 *
 * - 🌱 Easy - Low bundle size and fast build times
 *
 * @extension @packageDocumentation @betaDocumentation
 */

import {BudReactExtension} from './BudReactExtension'
import {BudReactRefreshPlugin} from './BudReactRefreshPlugin'
import {reactRefresh} from './reactRefresh'

declare module '@roots/bud-framework' {
  /**
   * {@inheritDoc @roots/bud-framework#Framework}
   * @public @override
   */
  interface Framework {
    reactRefresh: reactRefresh
  }

  /**
   * {@inheritDoc @roots/bud-framework#Modules}
   * @public @override
   */
  interface Modules {
    '@roots/bud-react': BudReactExtension
    '@pmmmwh/react-refresh-webpack-plugin': BudReactRefreshPlugin
  }
}

export const {name, boot} = BudReactExtension

export {BudReactExtension}
export {BudReactRefreshPlugin}
export {reactRefresh}
