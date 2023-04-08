module.exports = {
  plugins: {
    'postcss-import': {
      path: ['./assets/styles'],
    },
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.HUGO_ENVIRONMENT === 'production' ? { cssnano: {} } : {}),
  },
};
