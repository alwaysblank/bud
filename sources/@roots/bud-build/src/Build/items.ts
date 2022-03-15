import {Framework} from '@roots/bud-framework'

/**
 * .css handler factory
 *
 * @public
 */
export const css = (app: Framework) =>
  app.build
    .makeItem()
    .setLoader(`css`)
    .setOptions(({hooks}) => ({
      importLoaders: 1,
      sourceMap: hooks.filter('build.devtool') ?? false,
    }))

/**
 * .css handler factory
 *
 * @public
 */
export const cssModule = (app: Framework) =>
  app.build
    .makeItem()
    .setLoader(`css`)
    .setOptions(({hooks}) => ({
      importLoaders: 1,
      localIdentName: '[name]__[local]___[hash:base64:5]',
      modules: true,
      sourceMap: hooks.filter('build.devtool') ?? false,
    }))

/**
 * .csv handler factory
 *
 * @public
 */
export const csv = (app: Framework) =>
  app.build.makeItem().setLoader(`csv`)

/**
 * .html handler factory
 *
 * @public
 */
export const html = (app: Framework) =>
  app.build.makeItem().setLoader(`html`)

/**
 * Factory {@link Item} for style
 *
 * @public
 */
export const style = (app: Framework) =>
  app.build.makeItem().setLoader(`style`)

/**
 * Factory {@link Item} for markdown
 *
 * @public
 */
export const md = (app: Framework) => app.build.makeItem({loader: 'md'})

/**
 * Factory {@link Item} for minicss-extract-plugin
 * @public
 */
export const minicss = (app: Framework) =>
  app.build.makeItem().setLoader(`minicss`)

/**
 * CSS rule which accounts for env
 * @public
 */
export const precss = (app: Framework) =>
  app.build.makeItem().setLoader(app.isProduction ? `minicss` : `style`)

export const raw = ({build}: Framework) =>
  build.makeItem().setLoader(`raw`)

/**
 * Factory {@link Item} for file
 *
 * @public
 */
export const file = (app: Framework) =>
  app.build
    .makeItem()
    .setLoader(`file`)
    .setOptions(app => ({
      name: app.store.is('features.hash', true)
        ? app.store.get('hashFormat').concat('.[ext]')
        : app.store.get('fileFormat').concat('.[ext]'),
    }))

/**
 * Factory {@link Item} resolve-url
 *
 * @public
 */
export const resolveUrl = (app: Framework) =>
  app.build
    .makeItem()
    .setLoader(`resolveUrl`)
    .setOptions(({path, hooks}) => ({
      root: path('@src'),
      sourceMap: hooks.filter('build.devtool') ?? false,
    }))

/**
 * Factory {@link Item} for xml
 *
 * @public
 */
export const xml = (app: Framework) =>
  app.build.makeItem().setLoader(`xml`)
