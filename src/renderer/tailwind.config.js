module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#072245',
          100: '#e3e7eb',
          200: '#f6f7f8',
          300: '#f7f8f8',
          400: '#9fa9b3',
          500: '#617296',
          700: '#072245'
        },
        grey: {
          400: '#E8E8E9',
          500: '#F7F8F8',
          600: '#979797'
        },
        primary: {
          DEFAULT: '#00A893'
        }
      },
      radius: {
        rounded: '5px'
      }
    },
    minHeight: {
      '500px': '500px'
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
