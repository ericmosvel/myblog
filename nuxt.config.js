// const pkg =  require('./package')
const bodyParser = require('body-parser')

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  loadingIndicador: {
    name: 'circle',
    color: '#fa923f'
  },
  /*
  ** Global CSS
  */
  css: [
    // '~asset/styles/main.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/vue-inject.js',
    '~/plugins/date-filter.js'
    // { src: '~/plugins/localStorage', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    baseURL: process.env.BASE_URL || 'https://nuxtjs-54a9b.firebaseio.com',
    credentials: false
    // proxyHeaders: false
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },

  // variable de entorno q permite asignar a un solo punta de verdad la url del API request
  // de esta menera puedo con una sola instruccion implementar todas las API request
  env: {
    baseURL: process.env.BASE_URL || 'https://nuxtjs-54a9b.firebaseio.com',
    fbAPIKey: 'AIzaSyCK2T83T_shvdLsoTIrlyW4CzEK6JvS3eE'
  },

  /* router: {
    middleware: 'authenticated'
  } */
  serverMiddlware: [
    bodyParser.json(),
    '~/api'
  ]


}
