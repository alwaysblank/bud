import {Bud, Extension} from '@roots/bud-framework'

export interface EmotionCSS extends Extension.Module {}

export const name: EmotionCSS['name'] = '@roots/bud-emotion'

export const boot: EmotionCSS['boot'] = async ({babel}: Bud) => {
  babel?.setPlugins &&
    babel.setPlugin(
      '@emotion/babel-plugin',
      require.resolve('@emotion/babel-plugin'),
    )
}
