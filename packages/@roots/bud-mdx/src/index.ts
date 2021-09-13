// Copyright (c) Roots Foundation, LLC. All rights reserved. Licensed under the MIT license.

/**
 * Adds MDX support to Bud

 * @see https://roots.io/bud
 * @see https://github.com/roots/bud
 *
 * @extension @packageDocumentation @betaDocumentation
 */

import {Item, Loader, Rule} from '@roots/bud-build'
import {Extension, Framework} from '@roots/bud-framework'
import type * as Webpack from 'webpack'

import {MdxConfig} from './MdxConfig'

declare module '@roots/bud-framework' {
  interface Framework {
    /**
     * Configure mdx to suit your application needs
     */
    mdx: MdxConfig
  }

  interface Loaders {
    mdx: Loader
  }

  interface Items {
    mdx: Item
  }

  interface Modules {
    '@roots/bud-mdx': Extension.Module
  }
}

const extension: Extension.Module = {
  name: '@roots/bud-mdx',

  boot: (app: Framework) => {
    const {build, store, hooks} = app

    app.extensions.bindClass({
      mdx: [MdxConfig, app],
    })

    store.set('patterns.mdx', /\.mdx?$/)

    build.loaders.mdx = new Loader(
      require.resolve('@mdx-js/loader'),
    )

    build.items.mdx = new Item({
      loader: ({build}) => build.loaders.mdx,
      options: ({mdx}) => mdx.options,
    })

    build.rules.mdx = new Rule({
      test: ({store}) => store.get('patterns.mdx'),
      exclude: ({store}) => store.get('patterns.modules'),
      use: ({build}) => [build.items.babel, build.items.mdx],
    })

    hooks.on(
      'build/resolve/extensions',
      (exts: Webpack.Configuration['resolve']['extensions']) => [
        ...exts,
        '.mdx',
      ],
    )
  },
}

export const {name, boot} = extension
