import {bind, lodash, Signale} from '@roots/bud-support'

import {Bud} from '../../Bud'
import {factory} from '../../factory'
import {seed} from '../../seed'
import * as CLI from '../cli.interface'
import * as dynamic from './config/dynamic.config'
import * as manifest from './config/manifest.config'
import * as flags from './config/override.config'

const {isUndefined} = lodash

/**
 * @internal
 */
export class Runner {
  /**
   * @internal
   */
  public app: Bud

  /**
   * @internal
   */
  public logger: Signale

  /**
   * Class constructor
   *
   * @param cli - CLI state
   * @param options - Bud options
   * @internal
   */
  public constructor(public cli: CLI.Options) {}

  /**
   * Initialize bud application
   *
   * @internal
   * @decorator `@bind`
   */
  @bind
  public async initialize() {
    const parse = (value, fallback) =>
      isUndefined(value) ? fallback : value

    const settings = {
      config: {
        cli: this.cli,
        mode: parse(this.cli.flags.mode, 'production'),
        location: {
          project: parse(
            this.cli.flags['location.project'],
            seed.location.project,
          ),
          src: parse(this.cli.flags['location.src'], seed.location.src),
          dist: parse(this.cli.flags['location.dist'], seed.location.dist),
          storage: parse(
            this.cli.flags['location.storage'],
            seed.location.storage,
          ),
          publicPath: parse(
            this.cli.flags['publicPath'],
            seed.build.output.publicPath,
          ),
        },
        cache: {
          type: parse(this.cli.flags['cache.type'], seed.cache.type),
        },
        features: {
          cache: parse(this.cli.flags.cache, true),
          clean: parse(this.cli?.flags.clean, true),
          dashboard: parse(this.cli?.flags?.dashboard, true),
          hash: parse(this.cli.flags.hash, false),
          html: parse(this.cli.flags.html, false),
          inject: parse(this.cli.flags.inject, true),
          install: parse(this.cli.flags.install, false),
          log: parse(this.cli.flags.log, false),
          manifest: parse(this.cli.flags.manifest, true),
          splitChunks: parse(this.cli.flags.splitChunks, false),
        },
      },
    }

    this.app = await factory(settings)
    return this.app
  }

  /**
   * Main process
   *
   * @param build - Boolean value indicating if compilation should occur
   *
   * @internal
   * @decorator `@bind`
   */
  @bind
  public async make() {
    this.logger.success({
      prefix: 'runner',
      message: 'framework ready',
    })

    try {
      this.logger.time('process user configs')
      await dynamic.configs(this.app, this.logger)
      await manifest.configs(this.app, this.logger)
      this.logger.timeEnd('process user configs')
    } catch (error) {
      throw new Error(error)
    }

    await flags.config(this.app, this.cli.flags)

    return this.app
  }
}
