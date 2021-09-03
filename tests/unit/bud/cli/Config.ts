/* eslint-disable no-console */
import {Config} from '@roots/bud/src/cli/Config'
import {Framework} from '@roots/bud-framework'

import {mocks} from './__mocks__/index'

describe('Config', () => {
  let config: Config
  let bud: Framework

  beforeEach(async () => {
    bud = mocks.bud as unknown as Framework

    config = new Config(bud, [
      process.cwd().concat('/app/babel/bud.config.js'),
    ])
  })

  afterEach(() => {
    // spies
    jest.restoreAllMocks()
    // mocked fn
    jest.clearAllMocks()
  })

  it('get', () => {
    expect(config.get).toBeInstanceOf(Function)
  })

  it('get return config', async () => {
    const conf = await config.get()
    expect(conf).toBeInstanceOf(Object)
    expect(conf).toMatchSnapshot()
  })

  it('apply', () => {
    expect(config.apply).toBeInstanceOf(Function)
  })

  it('apply returns bud', async () => {
    const returnedValue = await config.apply()
    expect(returnedValue).toMatchSnapshot(bud)
  })

  /**
   * This might require a bit of a refactor
   * @todo refactor Config to allow for baseDir to be swapped out
   */
  it('returns function that behaves predictably', async () => {
    const userConf = await new Config(bud, [
      `/tests/unit/bud/cli/__mocks__/bud.config.js`,
    ]).get()

    expect(userConf).toBeInstanceOf(Function)

    userConf(bud)

    expect(bud.tap).toHaveBeenCalled()
    expect(bud.use).toHaveBeenCalled()
    expect(bud.entry).toHaveBeenCalled()
  })
})
