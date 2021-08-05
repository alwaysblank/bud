import {Container} from '@roots/container'
import {boundMethod as bind} from 'autobind-decorator'
import {isNull} from 'lodash'

import type {
  Api,
  Build,
  Cache,
  Compiler,
  Configuration,
  Dashboard,
  Dependencies,
  Discovery,
  Env,
  Extensions,
  Hooks,
  Logger,
  Module,
  Plugin,
  Server,
} from '../'
import {
  access,
  bootstrap,
  container,
  get,
  make,
  path,
  pipe,
  sequence,
  Service,
  setPath,
  Store,
  tap,
  when,
} from '../'

/**
 * The base class of a {@link Framework Framework instance}
 *
 * @remarks
 * Implementations must provide a {@link Framework.implementation} property
 * conforming to the {@link Framework.Constructor} interface
 *
 * This is in addition to all required {@link Framework.Options constructor parameters}.
 */
abstract class Framework {
  /**
   * Concrete implementation of the {@link Framework Framework interface}
   *
   * @virtual
   */
  public abstract implementation: Framework.Constructor

  /**
   * Framework name
   *
   * @remarks
   * In multi-compiler usages of the class, each instance has a unique name.
   */
  public name: string

  /**
   * Child {@link Framework} instances
   *
   * @remarks
   * Is `null` if the current instance is a child instance.
   *
   * @default null
   */
  public children: Container<Framework.Instances> = null

  /**
   * Compilation mode
   *
   * @remarks
   * Unlike webpack, there is no 'none' mode.
   *
   * @default 'production'
   */
  public mode: Framework.Mode = 'production'

  /**
   * Parent {@link Framework} instance
   *
   * @remarks
   * Is `null` if the current instance is the parent instance.
   *
   * @default null
   */
  public parent: Framework | null = null

  /**
   * Macros for assisting with common config tasks
   *
   * @internal
   * @virtual
   */
  public api: Api

  /**
   * Build configuration container
   *
   * @example
   * {@link Build.config} property contains the build config object:
   *
   * ```js
   * build.config
   * ```
   *
   * @example
   * Rebuild the configuration:
   *
   * ```js
   * build.rebuild()
   * ```
   *
   * @virtual
   */
  public build: Build

  /**
   * Determines cache validity and generates version
   * string based on hashed build configuration and project manifest files.
   *
   * @virtual
   */
  public cache: Cache

  /**
   * Compiles {@link Framework.build} configuration and stats/errors/progress reporting.
   *
   * @virtual
   */
  public compiler: Compiler

  /**
   * Presents build progress, stats and errors from {@link Framework.compiler} and {@link Framework.server}
   * over the CLI.
   *
   * @virtual
   */
  public dashboard: Dashboard

  /**
   * Utilities for interfacing with user package manager software
   *
   * @virtual
   */
  public dependencies: Dependencies

  /**
   * Project information and peer dependency management utilities
   *
   * @virtual
   */
  public discovery: Discovery

  /**
   * .env container
   *
   * @virtual
   */
  public env: Env

  /**
   * Container service for {@link Framework} extensions.
   *
   * @remarks
   * Extensions can be defined as a {@link Module}, which is more generic.
   *
   * They can also be defined as a {@link Plugin} which is a {@link Module}
   * specifically yielding a {@link WebpackPluginInstance}.
   *
   * When adding a {@link Module} or {@link Plugin} to the container
   * with {@link Extensions.add} it is cast to the {@link Extension} type.
   *
   * @virtual
   */
  public extensions: Extensions

  /**
   * Service allowing for fitering {@link Framework} values through callbacks.
   *
   * @example
   * Add a new entry to the `webpack.externals` configuration:
   *
   * ```js
   * hooks.on(
   *   'build/externals',
   *   externals => ({
   *     ...externals,
   *     $: 'jquery',
   *   }),
   * )
   * ```
   *
   * @example
   * Change the `webpack.output.filename` format:
   *
   * ```js
   * hooks.on(
   *   'build/output/filename',
   *   () => '[name].[hash:4]',
   * )
   * ```
   *
   * @virtual
   */
  public hooks: Hooks

  /**
   * Logging service
   *
   * @virtual
   */
  public logger: Logger

  /**
   * Development server and browser devtools
   *
   * @virtual
   */
  public server: Server

  /**
   * Container service for holding {@link Configuration} values
   *
   * @sealed
   */
  public store: Store

  /**
   * True when {@link Framework.mode} is `production`
   */
  public get isProduction(): boolean {
    return this.mode === 'production'
  }

  /**
   * True when {@link Framework.mode} is `development`
   */
  public get isDevelopment(): boolean {
    return this.mode === 'development'
  }

  /**
   * Framework constructor options
   *
   * @remarks
   * Saved as a property from the constructor so options
   * can be referenced from child instances.
   */
  public options: Framework.Options

  /**
   * Class constructor
   */
  public constructor(options: Framework.Options) {
    // Clone options parameter so as to not mutate other instances
    this.options = {...options}

    this.name = this.options.name
    this.mode = this.options.mode

    // Assign parent/child references
    if (isNull(this.options.parent))
      this.children = new Container({})
    else this.parent = this

    // Bindings
    this.access = this.access.bind(this)
    this.bootstrap = this.bootstrap.bind(this)
    this.container = this.container.bind(this)
    this.get = this.get.bind(this)
    this.make = this.make.bind(this)
    this.path = this.path.bind(this)
    this.pipe = this.pipe.bind(this)
    this.setPath = this.setPath.bind(this)
    this.sequence = this.sequence.bind(this)
    this.tap = this.tap.bind(this)
    this.when = this.when.bind(this)
  }

  /**
   * Access a value which may or may not be a function.
   *
   * @remarks
   * If a value is a function **access** will call that function and return the result.
   *
   * If the value is not a function **access** will return its value.
   *
   * @example
   * ```js
   * const isAFunction = (option) => `option value: ${option}`
   * const isAValue = 'option value: true'
   *
   * access(isAFunction, true) // => `option value: true`
   * access(isAValue) // => `option value: true`
   * ```
   */
  public access: access = access

  /**
   * Initializes and binds {@link Framework.services}
   *
   * @example
   * ```js
   * new FrameworkImplementation(...constructorParams).bootstrap()
   * ```
   */
  public bootstrap: bootstrap = bootstrap

  /**
   * Create a new {@link Container} instance
   *
   * @example
   * ```js
   * const myContainer = bud.container({key: 'value'})
   *
   * myContainer.get('key') // returns 'value'
   * ```
   */
  public container = container

  /**
   * Returns a {@link Framework} instance from the {@link Framework.children} container
   *
   * @remarks
   * An optional {@link tap} function can be provided to configure the returned Framework instance.
   *
   * @example
   * ```js
   * bud.get('pluginName', (plugin) => plugin.entry('main', 'main.js'))
   * ```
   */
  public get: get = get

  /**
   * Instantiate a child instance and add to {@link Framework.children} container
   *
   * @remarks
   * **make** takes two parameters:
   *
   * - The **name** of the new compiler
   * - An optional callback to use for configuring the compiler.
   *
   * @example
   * ```js
   * bud.make('scripts', child => child.entry('app', 'app.js'))
   * ```
   *
   * @example
   * This function returns the parent bud instance for further chaining.
   *
   * It is also possible to reference the parent instance using {@link Framework.parent}.
   *
   * ```js
   * make('scripts', child => {
   *   child.entry('app', 'app.js')
   *   child.parent.dev({
   *     // ...
   *   })
   * })
   * ```
   */
  public make: make = make

  /**
   * Returns a {@link Framework.Location} as an absolute path
   */
  public path: path = path

  /**
   * Pipe a value through an array of functions. The return value of each callback is used as input for the next.
   *
   * @remarks
   * If no value is provided the value is assumed to be the {@link Framework} itself
   *
   * {@link sequence} is a non-mutational version of this method.
   *
   * @example
   * ```js
   * app.pipe(
   *   [
   *     value => value + 1,
   *     value => value + 1,
   *   ],
   *   1, // initial value
   * ) // resulting value is 3
   * ```
   */
  public pipe: pipe = pipe

  /**
   * Set a {@link Framework.Location} value
   *
   * @remarks
   * The project directory should be an absolute path.
   * All other directories should be relative (src, dist, etc.)
   * @see {@link Framework.Locations}
   *
   * @example
   * ```js
   * bud.setPath('src', 'custom/src')
   * ```
   */
  public setPath: setPath = setPath

  /**
   * Run a value through a sequence of non mutational functions.
   *
   * @remarks
   * Unlike {@link pipe} the value returned from each function is ignored.
   */
  public sequence = sequence

  /**
   * Execute a callback
   *
   * @remarks
   * Callback is provided {@link Framework the Framework instance} as a parameter.
   *
   * @example
   * ```js
   * bud.tap(bud => {
   *   // do something with bud
   * })
   * ```
   *
   * @example
   * Lexical scope is bound to {@link Framework} where applicable, so it is possible to reference the {@link Framework instance} using `this`.
   *
   * ```js
   * bud.tap(function () {
   *  // do something with this
   * })
   * ```
   */
  public tap: tap = tap

  /**
   * Executes a function if a given test is `true`.
   *
   * @remarks
   * - The first parameter is the conditional check.
   * - The second parameter is the function to run if `true`.
   * - The third parameter is optional; executed if the conditional is not `true`.
   *
   * @example
   * Only produce a vendor bundle when running in `production` {@link Mode}:
   *
   * ```js
   * bud.when(bud.isProduction, () => bud.vendor())
   * ```
   *
   * @example
   * Use `eval` sourcemap in development mode and `hidden-source-map` in production:
   *
   * ```js
   * bud.when(
   *   bud.isDevelopment,
   *   () => bud.devtool('eval'),
   *   () => bud.devtool('hidden-source-map'),
   * )
   * ```
   */
  public when: when = when

  /**
   * Log a message
   *
   * @decorator `@bind`
   */
  @bind
  public log(message?: any, ...optionalArgs: any[]) {
    this.logger.instance
      .scope(this.name)
      .log(message, ...optionalArgs)
  }

  /**
   * Log an `info` level message
   *
   * @decorator `@bind`
   */
  @bind
  public info(message?: any, ...optionalArgs: any[]) {
    this.logger.instance
      .scope(this.name)
      .info(message, ...optionalArgs)
  }

  /**
   * Log a `success` level message
   *
   * @decorator `@bind`
   */
  @bind
  public success(message?: any, ...optionalArgs: any[]) {
    this.logger.instance
      .scope(this.name)
      .success(message, ...optionalArgs)
  }

  /**
   * Log a `warning` level message
   *
   * @decorator `@bind`
   */
  @bind
  public warn(message?: any, ...optionalArgs: any[]) {
    this.logger.instance
      .scope(this.name)
      .warn(message, ...optionalArgs)
  }

  /**
   * Log a `debug` level message
   *
   * @decorator `@bind`
   */
  @bind
  public debug(message?: any, ...optionalArgs: any[]) {
    this.logger.instance
      .scope(this.name)
      .debug(message, ...optionalArgs)
  }

  /**
   * Log and display an error.
   *
   * @remark
   * This error is fatal and will kill the process
   *
   * @decorator `@bind`
   */
  @bind
  public error(message?: any, ...optionalArgs: any[]) {
    this.logger.instance
      .scope(this.name)
      .error(message, ...optionalArgs)

    this.dashboard.renderError(message, optionalArgs.pop())
  }
}

namespace Framework {
  /**
   * Hash of a given object type
   */
  export type Index<T = any> = {[key: string]: T}

  /**
   * Compilation mode
   */
  export type Mode = 'production' | 'development'

  /**
   * Registered loaders
   */
  export interface Loaders
    extends Framework.Index<Build.Loader> {
    css: Build.Loader
    csv: Build.Loader
    html: Build.Loader
    md: Build.Loader
    raw: Build.Loader
    style: Build.Loader
    file: Build.Loader
    url: Build.Loader
    minicss: Build.Loader
    'resolve-url': Build.Loader
    xml: Build.Loader
  }

  /**
   * Registered items
   */
  export interface Items extends Framework.Index<Build.Item> {
    css: Build.Item
    csv: Build.Item
    file: Build.Item
    image: Build.Item
    font: Build.Item
    html: Build.Item
    js: Build.Item
    md: Build.Item
    minicss: Build.Item
    'resolve-url': Build.Item
    raw: Build.Item
    style: Build.Item
    svg: Build.Item
    xml: Build.Item
  }

  /**
   * Registered rules
   */
  export interface Rules extends Framework.Index<Build.Rule> {
    js: Build.Rule
    css: Build.Rule
    html: Build.Rule
    svg: Build.Rule
    image: Build.Rule
    font: Build.Rule
    xml: Build.Rule
    json5: Build.Rule
    csv: Build.Rule
    yml: Build.Rule
    toml: Build.Rule
  }

  /**
   * Registered locations
   */
  export interface Locations extends Framework.Index<string> {
    project: string
    src: string
    dist: string
    publicPath: string
    storage: string
    modules: string
  }

  /**
   * Registered modules
   */
  export interface Modules extends Index<Module | Plugin> {}

  /**
   * Registered services
   */
  export interface Services
    extends Index<new (app: Framework) => Service> {}

  /**
   * Registered compilers
   */
  export interface Instances extends Index<Framework> {}

  /**
   * Registered extensions
   */
  export interface Extensions extends Index<Module | Plugin> {}

  /**
   * Framework Constructor
   */
  export type Constructor = new (options: Options) => Framework

  /*
   * Constructor options
   */
  export interface Options {
    name: string
    mode: Framework.Mode
    config: Configuration
    services: Framework.Services
    parent?: Framework
  }

  /**
   * Callback which accepts Framework as a parameter
   */
  export type Tapable<I = any> =
    | ((app: Framework) => I)
    | ((this: Framework, app?: Framework) => I)
}

export {Framework}
