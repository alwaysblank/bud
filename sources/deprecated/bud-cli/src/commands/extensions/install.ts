import {config, Framework} from '@roots/bud'

import Build from '../../Build'
import Command from '../../Command'
import Runner from '../../Runner'
export default class Install extends Command {
  public static description =
    'Install packages required by extensions'

  public static aliases = ['init']

  public static examples = [`$ bud extensions:install`]

  public cli: {flags: any; args: any}

  public app: Framework

  public async run() {
    this.cli = this.parse(Build)

    const runner = new Runner(this.cli, {
      config,
      mode: 'production',
    })

    this.app = await runner.make()

    this.app.discovery.install()

    process.exit()
  }
}
