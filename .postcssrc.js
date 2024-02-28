// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    'autoprefixer': {browsers: 'last 5 version'}
    // to edit target browsers: use "browserslist" field in package.json
  }
}
