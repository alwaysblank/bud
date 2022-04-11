import { Bud } from '../bud'

export interface Events {
  'app.close': (app: Bud) => Promise<unknown>
  'build.before': (app: Bud) => Promise<unknown>
  'build.after': (app: Bud) => Promise<unknown>
  'compiler.before': (app: Bud) => Promise<unknown>
  'compiler.after': (app: Bud) => Promise<unknown>
  'compiler.done': (app: Bud) => Promise<unknown>
  'compiler.error': (app: Bud) => Promise<unknown>
  'dashboard.q': (app: Bud) => Promise<unknown>
  'project.write': (app: Bud) => Promise<unknown>
  'run': (app: Bud) => Promise<unknown>
  'server.before': (app: Bud) => Promise<unknown>
  'server.listen': (app: Bud) => Promise<unknown>
  'server.after': (app: Bud) => Promise<unknown>
  'proxy.interceptor': (app: Bud) => Promise<unknown>
}
