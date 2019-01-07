// needed for async/await syntax
require("babel-polyfill");

// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
  sourceMaps: true,
  presets: [ 'env' ],
  plugins: [
    "transform-es2015-destructuring",
    "transform-object-rest-spread",
    "transform-decorators-legacy",
    "transform-class-properties"
  ]
})

// Import the rest of our application.
module.exports = require('./app.js')
