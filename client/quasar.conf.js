// Configuration for your app

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'axios',
      'authenticate',
      'vuelidate',
      'vuelidate-error-extractor',
      'global-components',
      'moment',
      'custom-filters',
      'lodash',
      'vue-analytics',
      'leaflet',
    ],

    css: [
      'app.styl'
    ],

    extras: [
      'roboto-font',
      'material-icons' // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons'
    ],

    framework: {
      // all: true, // --- includes everything; for dev only!

      components: [
        'QLayout',
        'QHeader',
        'QFooter',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QAvatar',
        'QMenu',
        'QCardSection',
        'QSeparator',
        'QScrollArea',
        'QCard',
        'QCardActions',
        'QCheckbox',
        'QDialog',
        'QInput',
        'QTabs',
        'QPageSticky',
        'QTooltip',
        'QSelect',
        'QRouteTab',
        'QField',
        'QOptionGroup',
        'QDate',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QUploader',
        'QLinearProgress',
        'QPopupProxy',
        'QTab',
        'QTabPanels',
        'QTabPanel',
        'QChip',
        'QSpinnerFacebook',
        'QSpace',
        'QCircularProgress',
        'QImg',
        'QInfiniteScroll',
        'QResizeObserver',
        'QExpansionItem',
        'QBadge',
        'QBtnToggle',
        'QTree',
        'QRadio',
        'QToggle',
        'QTimeline',
        'QTimelineEntry',
      ],

      directives: [
        'ClosePopup',
        'Ripple',
      ],

      // Quasar plugins
      plugins: [
        'Dialog',
        'Notify',
        'Cookies',
      ]

      // iconSet: 'ionicons-v4'
      // lang: 'de' // Quasar language
    },

    build: {
      env: ctx.dev ? {
        NODE_ENV: 'development',
        PRODUCT_NAME: require('./package.json').productName,
        DESCRIPTION: require('./package.json').description
      } : {
        NODE_ENV: 'production',
        PRODUCT_NAME: require('./package.json').productName,
        DESCRIPTION: require('./package.json').description
      },
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack(cfg) {
      }
    },

    devServer: {
      // https: true,
      port: 3001,
      open: false, // opens browser window automatically
      proxy: {
        // proxy all requests starting with /api to nodejs server
        '/api': {
          target: 'http://api:3000',
          changeOrigin: true,
        },
        '/map': {
          target: 'http://mapserver',
        }
      }
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
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
            'src': 'icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
      // noIosLegacyBuildFlag: true // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack(cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
