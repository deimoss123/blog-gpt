/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            pre: false,
            'pre code': {
              display: 'inherit',
              borderRadius: '0.5rem',
              fontSize: '14px',
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
  plugins: [
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss')({ prefix: 'ui' }),
    require('prettier-plugin-tailwindcss'),
  ],
};
