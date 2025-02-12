import {Bud} from '..'

/**
 * Close interface
 *
 * @param this - {@link @roots/bud-Bud#Bud}
 * @param done - Callback function to be called before end of run
 *
 * @public
 */
export interface close {
  (done?: CallableFunction): Promise<void>
}

/**
 * Exit the program
 *
 * @param callback - Callback function to be called before end of run
 *
 * @public
 */
export function close(callback?: any) {
  const ctx = this as Bud

  ctx.hooks.fire('event.app.close')

  callback ? callback() : process.exit()
}
