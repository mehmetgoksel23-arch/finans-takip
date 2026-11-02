/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0B0F19', // Çok koyu zemin
          900: '#111827', // Kart zemini
          850: '#161F30', // İkincil kart zemini
          800: '#1F2937', // Kenarlıklar
          700: '#374151',
        },
        brand: {
          emerald: '#10B981',
          cyan: '#06B6D4',
          indigo: '#6366F1',
          rose: '#F43F5E',
          amber: '#F59E0B',
        }
      }
    },
  },
  plugins: [],
}
