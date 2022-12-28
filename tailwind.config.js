module.exports = {
  content: ['./src/**/*.{html,ts}'],
  safelist: ['bg-blue-400', 'bg-green-400', 'bg-red-400'],
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity:["disabled"],
      cursor:["disabled"],
      backgroundColor:["disabled"]
    },
    //opacity: ({ after }) => after(['disabled']),
  },
  plugins: [],
}
