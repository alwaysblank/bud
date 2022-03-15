import {lodash} from '@roots/bud-support'
import {Container} from '@roots/container'

import {Locations} from './'
import {ConfigMap} from './config.map'
import {Framework} from './Framework'
import {Service} from './Service'

const {get, set} = lodash

/**
 * Container store for initial configuration and general options
 *
 * @public
 */
export class Store<T = Store.Repository> extends Service<T> {
  /**
   * Service identifier
   *
   * @public
   */
  public ident: string = 'store'

  /**
   * Store constructor
   *
   * @param app - Framework
   * @param options - Partial framework config
   */
  public constructor(app: Framework, options: Partial<Store.Repository>) {
    super(app)
    this.repository = options
  }

  /**
   * Get a store value
   *
   * @override
   */
  public get<K extends keyof Store.Map & string, T = Store.Map[K]>(
    path: K,
  ): T {
    return get(this.repository, path)
  }

  /**
   * Set a store value
   *
   * @override
   */
  public set<K extends keyof Store.Map & string, T = Store.Map[K]>(
    path: K,
    value: T,
  ) {
    set(this.repository, path, value)
    return this
  }
}

export type FrameworkCallable<T> = (app: Framework) => T

export type CompilerConfigCallables = {
  [K in keyof ConfigMap as `${K & string}`]: FrameworkCallable<
    ConfigMap[K]
  >
}

export namespace Store {
  /**
   * Framework base configuration
   *
   * @remarks
   * These are just initial values. They can be overwritten by the user, or extended by the framework/modules.
   * It is recommended to use {@link @roots/bud-framework#Hooks.on} to extend the
   *
   * @public
   */
  export interface Repository extends CompilerConfigCallables {
    /**
     * Application name
     *
     * @public
     */
    name: string

    /**
     * Logger settings
     *
     * @public
     */
    ['log.count']: Container

    /**
     * Log level
     *
     * @remarks
     * This is a little weird. It is not a standard log level (working around
     * Signale stuff). It would be better if 'log' and 'debug' were swapped.
     *
     * Map of levels:
     * - 'error' (least verbose)
     * - 'warn'
     * - 'log' (default)
     * - 'debug' (most verbose)
     *
     * @public
     */
    ['log.level']: 'v' | 'vv' | 'vvv' | 'vvvv'

    /**
     * Is caching enabled?
     *
     * @public
     */
    ['features.cache']?: boolean

    /**
     * Feature toggle: Clean dist before compilation
     *
     * When enabled stale assets will be removed from
     * the `@dist` directory prior to the next
     * compilation.
     *
     * @defaultValue true
     *
     * @public
     */
    ['features.clean']?: boolean

    /**
     * Enable or disable filename hashing
     *
     * @defaultValue false
     *
     * @public
     */
    ['features.hash']?: boolean

    /**
     * Emit html template
     *
     * @defaultValue true
     *
     * @public
     */
    ['features.html']?: boolean

    /**
     * Automatically inject installed extensions
     *
     * @public
     */
    ['features.inject']?: boolean

    /**
     * Log to console
     *
     * @defaultValue false
     *
     * @public
     */
    ['features.log']?: boolean

    /**
     * Enable or disable producing a manifest.json file
     *
     * @defaultValue true
     *
     * @public
     */
    ['features.manifest']?: boolean

    /**
     * Enable or disable proxy
     */
    ['features.proxy']?: boolean

    /**
     * Enable or disable runtime chunk
     *
     * @public
     */
    ['features.runtimeChunk']?: boolean

    /**
     * Enable or disable chunk splitting (vendor)
     *
     * @defaultValue false
     *
     * @public
     */
    ['features.splitChunks']?: boolean

    /**
     * Shared regular expressions for pattern matching.
     *
     * @example
     * ```js
     * app.patterns.get('js')
     * ```
     *
     * @public
     */
    patterns: Record<string, RegExp>

    /**
     * Registered fs directories
     *
     * @public
     */
    location: Partial<Locations> & {
      '@src': string
      '@dist': string
      '@modules': string
      '@storage': string
    }

    /**
     * File format (when hashing is disabled)
     *
     * @remarks
     * do not include extension
     *
     * @defaultValue '[name]'
     *
     * @public
     */
    fileFormat: string
    /**
     * File format when hashing is enabled
     *
     * @remarks
     * do not include extension
     *
     * @defaultValue '[name].[contenthash:6]'
     *
     * @public
     */
    hashFormat: string

    /**
     * Initial webpack configuration values
     *
     * @public
     */
  }

  export interface LoggerKeyMap {
    ['log.count']: Repository['log.count']
    ['log.level']: Repository['log.level']
  }

  export interface Map
    extends RepositoryKeyMap,
      LocationKeyMap,
      PatternKeyMap,
      CompilerConfigCallables,
      LoggerKeyMap {}

  type RepositoryKeyMap = {
    [K in keyof Repository as `${K & string}`]: Repository[K]
  }

  type LocationKeyMap = {
    [K in keyof Repository['location'] as `location.${K &
      string}`]: Repository['location'][K]
  }

  type PatternKeys =
    | 'js'
    | 'css'
    | 'font'
    | 'image'
    | 'modules'
    | 'html'
    | 'ts'
    | 'sass'
    | 'cssModule'
    | 'sassModule'
    | 'svg'
    | 'vue'
    | 'md'
    | 'json'
    | 'json5'
    | 'toml'
    | 'yml'
    | 'xml'
    | 'csv'
    | 'webp'

  type PatternKeyMap = {
    [K in PatternKeys as `patterns.${K &
      string}`]: Repository['patterns'][K]
  }
}
