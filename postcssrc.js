const { PATHS } = require('./tools/config');


const NODE_ENV = process.env.NODE_ENV || 'development';

const vmincalc = function(value, base = 375) {
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
};

module.exports = {
  plugins: {
    'postcss-import': { path: [`${PATHS.srcDir}css`] },
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
