Compile and serve source assets

━━━ Usage ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$ bud dev

━━━ Options ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  --cache                   Utilize compiler's filesystem cache
  --clean                   Clean artifacts and distributables prior to compilation
  --debug                   Enable debugging mode. Very verbose logging. Writes output files to `@storage` directory
  --devtool #0              Set devtool option
  --flush                   Force clearing bud internal cache
  --hash                    Hash compiled filenames
  --html                    Generate an html template
  --input,-i #0             Source directory (relative to project)
  --output,-o #0            Distribution directory (relative to project)
  --storage #0              Storage directory (relative to project)
  --indicator               Enable development status indicator
  --log                     Enable logging
  --manifest                Generate a manifest of compiled assets
  --minimize                Minimize compiled assets
  --modules #0              Module resolution path
  --notify                  Enable notfication center messages
  --overlay                 Enable error overlay in development mode
  --publicPath #0           public path of emitted assets
  --splitChunks,--vendor    Separate vendor bundle
  --target,-t #0            Limit compilation to particular compilers
  --verbose                 Set logging level

━━━ Examples ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Start dev server and compile assets in dev mode
  $ bud dev