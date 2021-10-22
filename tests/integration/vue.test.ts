import {Project} from '../util/integration'

jest.setTimeout(60000)

describe('examples/vue', () => {
  let project: Project

  beforeAll(async () => {
    project = new Project({
      name: 'vue',
      dir: 'examples/vue',
    })

    await project.setup()
  })

  describe('package.json', () => {
    it('matches snapshot', () => {
      expect(project.packageJson).toMatchSnapshot({
        browserslist: {
          development: [
            'last 1 chrome version',
            'last 1 firefox version',
            'last 1 safari version',
          ],
          production: ['>0.5%', 'not dead', 'not op_mini all'],
        },
        devDependencies: {
          '@roots/bud': 'workspace:*',
          '@roots/bud-vue': 'workspace:*',
          '@vue/compiler-sfc': expect.any(String),
          vue: expect.any(String),
        },
        name: 'example-vue',
        private: true,
      })
    })
  })

  describe('app.js', () => {
    it('has contents', () => {
      expect(project.assets['app.js'].length).toBeGreaterThan(10)
    })

    it('is transpiled', () => {
      expect(
        project.assets['app.js'].includes('import'),
      ).toBeFalsy()
    })
  })
})
