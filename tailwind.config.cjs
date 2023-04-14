const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./assets/**/*.css', './content/**/*.md', './layouts/**/*.html', './node_modules/flowbite/**/*.js'],
  darkMode: 'class',
  plugins: [require('@tailwindcss/typography'), require('flowbite/plugin')],
  theme: {
    extend: {
      colors: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
      },
      fontFamily: {
        sans: ['var(--aw-font-sans)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading)', ...defaultTheme.fontFamily.sans],
      },
      typography: {
        DEFAULT: {
          css: {
            img: {
              'background-color': '#f8fafc',
            },
            'code::before': false,
            'code::after': false,
            'blockquote p:first-of-type::before': false,
            'blockquote p:last-of-type::after': false,
          },
        },
      },
    },
  },
};
