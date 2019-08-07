const path = require('path')
const snakeCase = require('lodash/snakeCase')

const info = require('./package.json')

exports.onCreateWebpackConfig = ({ stage, actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        APP_NAME: JSON.stringify(snakeCase(info.name).toUpperCase()),
      }),
    ],
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  })
}
