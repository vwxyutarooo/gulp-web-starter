const { PATHS, AUTOPREFIX } = require('./tools/config');


module.exports = {
  plugins: {
    stylelint: {},
    'postcss-import': { path: [PATHS.srcDir + 'css'], },
    // 'postcss-nesting': {},
    'postcss-css-variables': {},
    'postcss-functions': {
      functions: {
        vmincalc: function(value, base = 375) {
          let vminValues = value.split(' ');

          if (!vminValues.length) {
            console.warn('Parameter: value does not valid.');
            return value;
          }

          vminValues = vminValues.map((number) => {
            if (number === 0) return 0;

            let int = parseInt(number, 10);

            return (isNaN(int)) ? number : (int / base * 100).toFixed(6) + 'vmin';
          });

          return vminValues.join(' ');
        }
      }
    },
    // 'postcss-color-function': {},
    'postcss-mixins': {},
    'postcss-cssnext': { browsers: AUTOPREFIX },
    precss: {},
    cssnano: { autoprefixer: false, reduceTransforms: false }
  }
};
