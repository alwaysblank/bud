import {CommandClass, Option} from 'clipanion'

import {Command} from './base.command'

export class Test extends Command {
  /**
   * Command paths
   *
   * @public
   */
  public static paths: CommandClass['paths'] = [[`@bud`, `test`]]

  /**
   * Command usage
   *
   * @public
   */
  public static usage: CommandClass['usage'] = {
    category: `@bud`,
    details: `test files with jest`,
    examples: [
      [`test`, `yarn @bud test`],
      [`update snapshots`, `yarn @bud test --update`],
    ],
  }

  /**
   * Number of workers
   *
   * @public
   */
  public workers = Option.String(`-w,--workers`, '50%', {
    description: `number of workers. default 50%.`,
  })

  /**
   * Update snapshots
   *
   * @public
   */
  public update = Option.Boolean(`--update`, false, {
    description: `update snapshots. default false.`,
  })

  /**
   * Execute command
   *
   * @public
   */
  public async execute() {
    await this.$(
      `yarn jest --config config/jest.config.js --verbose --maxWorkers=${
        this.workers
      } ${this.update ? `--updateSnapshot` : `--coverage`}`,
    )
  }
}
