// Configuration for your app
var webpack = require("webpack");

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'i18n',
      'axios',
      'authenticate',
      'moment',
      'socket',
      'intro'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      'mdi',
      'ionicons',
      'fontawesome'
    ],
    supportIE: true,
    build: {
      env: ctx.dev ? {
        NODE_ENV: JSON.stringify('development'),
        API_ENDPOINT: JSON.stringify('http://localhost:3000'),
        S3_BUCKET: JSON.stringify('https://s3-ap-southeast-2.amazonaws.com/qa4lab-development'),
        PRODUCT_NAME: JSON.stringify(require('./package.json').productName),
        DESCRIPTION: JSON.stringify(require('./package.json').description)
      } : {
        NODE_ENV: JSON.stringify('production'),
        API_ENDPOINT: JSON.stringify('https://beta.api.qa4lab.com'),
        S3_BUCKET: JSON.stringify('https://s3-ap-southeast-2.amazonaws.com/qa4lab-staging'),
        PRODUCT_NAME: JSON.stringify(require('./package.json').productName),
        DESCRIPTION: JSON.stringify(require('./package.json').description)
      },
      scopeHoisting: true,
      vueRouterMode: 'history',
      devtool: '#eval-source-map',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack(cfg) {
        // cfg.module.rules.push({
        // enforce: 'pre',
        // test: /\.(js|vue)$/,
        // loader: 'eslint-loader',
        // exclude: /(node_modules|quasar)/
        // })
        cfg.plugins.push(
          new webpack.ProvidePlugin({
            // other modules
            introJs: ['intro.js', 'introJs']
          })
        )
      }
    },
    devServer: {
      // https: true,
      port: 3001,
      open: false // opens browser window automatically
    },
    framework: 'all',
    animations: 'all',
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack(cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0'
  }
}
