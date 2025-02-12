import {Bud, factory} from '@repo/test-kit/bud'
import * as BudSass from '@roots/bud-sass/src/index'

describe('@roots/bud-sass registration', () => {
  let bud: Bud
  beforeAll(async () => {
    bud = await factory()
    await BudSass.boot(bud, bud.extensions.logger)
  })

  it('adds postcss-scss syntax', () => {
    expect(
      bud.hooks.filter('extension.@roots/bud-postcss.options').syntax,
    ).toBe('postcss-scss')
  })
})
