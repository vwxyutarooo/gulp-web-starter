const path = require('path');
const { PATHS } = require('./tools/config');


const vmincalc = (value, base = 375) => {
  let vminValues = value.split(' ');

  if (!vminValues.length) {
    console.warn('Parameter: value does not valid.');
    return value;
  }

  vminValues = vminValues.map((number) => {
    if (number === 0) return 0;

    const int = parseInt(number, 10);

    /* eslint-disable no-mixed-operators */
    return (Number.isNaN(int)) ? number : `${(int / base * 100).toFixed(6)}vmin`;
  });

  return vminValues.join(' ');
};

module.exports = {
  plugins: {
    'postcss-import': { path: [path.resolve(PATHS.srcDir, 'css')] },
    'postcss-mixins': {},
    'postcss-nested': {},
    'postcss-css-variables': {},
    'postcss-color-function': {},
    'postcss-custom-media': {},
    'postcss-functions': {
      functions: { vmincalc }
    },
    autoprefixer: {},
    cssnano: {
      autoprefixer: false,
      reduceTransforms: false
    }
  }
};
