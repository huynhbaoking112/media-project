
module.exports = {
  purge: ["./src/**/*.{html,js,jsx}"],
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        king: ['Lobster'],
        king2:['AlumniSansInlineOne'],
        king3:['JosefinSans'],
        king4:['VinaSans']
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0%)' }
        }
      },
      animation: {
        'slide-slow': 'slide 2s ease-out',
      }
      
    },
  
  },
  plugins: [],
};
