import type {Container} from '@roots/container'
import type {WatchOptions} from 'chokidar'
import type {Application, Handler} from 'express'
import type * as Proxy from 'http-proxy-middleware'
import type * as Webpack from 'webpack'
import type * as DevMiddleware from 'webpack-dev-middleware'

import type {Service} from './'

/**
 * @noInherit
 */
interface Server extends Service {
  /**
   * Registered server middlewares
   */
  middleware: Server.Middleware.Inventory

  /**
   * Assets
   */
  assets: string[]

  /**
   * Server instance
   */
  instance: Server.Instance

  /**
   * Server configuration
   */
  config: Server.Config

  /**
   * Has files to watch and watch is enabled
   */
  isWatchable: boolean

  /**
   * Watcher instance
   */
  watcher: {
    [key: string]: any
    close: CallableFunction
    on: CallableFunction
  }

  /**
   * Retrieve an array of watched files.
   */
  getWatchedFilesArray(): string[]

  /**
   * Run the server instance
   */
  run(): this

  /**
   * Inject client scripts innto compilation (HMR, dev experience)
   */
  inject(): void
}

namespace Server {
  /**
   * Server instance
   */
  export type Instance = Application

  /**
   * Webpack compiler
   */
  export type Compiler = Webpack.Compiler | Webpack.MultiCompiler

  /**
   * Middleware
   */
  export type Middleware = any

  export namespace Middleware {
    export interface Inventory {
      [key: string]: Middleware
    }

    export interface Options {
      config: Config
      compiler: Compiler
    }

    export type Init = (options: Options) => Middleware

    export type Proxy = Proxy.RequestHandler & Handler

    export interface Target {
      host: string
      port: number
    }
  }

  /**
   * Configuration container
   */
  export type Config = Container<Configuration>

  /**
   * Server configuration
   */
  export interface Configuration {
    /**
     * Enabled middlewares
     */
    middleware?: {
      [key: string]: boolean
    }

    /**
     * The development server host
     * @default localhost
     */
    host?: string

    /**
     * The development server port
     * @default 3000
     */
    port?: number

    /**
     * Proxy destination
     */
    proxy?: {
      /**
       * Proxy destination host
       * @default localhost
       */
      host?: string

      /**
       * Proxy destination port
       * @default 8000
       */
      port?: number
    }

    /**
     * Files which should reload the browser when changed.
     */
    watch?: {
      files: string[]
      options: WatchOptions
    }

    /**
     * Client features
     */
    browser?: {
      log?: boolean
      indicator?: boolean
      overlay?: boolean
    }

    /**
     * The index path for web server, defaults to "index.html".
     */
    index?: DevMiddleware.Options['index']

    /**
     * The path that the middleware is bound to.
     */
    publicPath?: DevMiddleware.Options['publicPath']

    /**
     * Filename to serve as index.
     */
    filename?: string

    /**
     * This property for  passing  custom
     * HTTP headers on each request.
     *
     * @example
     *
     * ```json
     * { "X-Custom-Header": "yes" }
     * ```
     */
    headers?: DevMiddleware.Options['headers']

    /**
     * This property for  passing  the
     * list of HTTP request methods accepted
     *
     *  @example
     *
     * ```json
     * ['GET', 'HEAD']
     * ```
     */
    methods?: DevMiddleware.Options['methods']

    /**
     * This property for  to register custom
     * mime types or extension mappings
     */
    mimeTypes?: DevMiddleware.MimeTypeMap

    /**
     * Escape hatch for Webpack's host check security feature.
     */
    disableHostCheck?: DevMiddleware.Options[]
  }
}

/**
 * @exports Server
 */
export {Server}
