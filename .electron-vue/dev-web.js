process.env.NODE_ENV = "development"

const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const portfinder = require("portfinder");
const webConfig = require("./webpack.web.config");
const utils = require('./utils');
const host = process.env.HOST || '127.0.0.1'

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || '8089'

  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
      return
    }

    webConfig.plugins.push(new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${host}:${port}`],
      },
      onErrors: utils.createNotifierCallback()
    }))
    webConfig.devServer = {
      historyApiFallback: true,
      hot: true,
      host: host,
      port: port,
      open: true,
      overlay: {
        warnings: false,
        errors: true,
      },
      proxy: {
        // '/api': {
        //   target: 'http://39.104.28.207:8989',
        //   changeOrigin: true,
        //   pathRewrite: {
        //     '^/api': ''
        //   }
        // }
      },
      publicPath: '/',
      quiet: true
    }
    resolve(webConfig)
  })
})