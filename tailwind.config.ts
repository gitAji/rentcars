import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0070f3',
        secondary: '#ffffff',
        accent: '#f5a623',
        'accent-dark': '#e49512',
        neutral: '#424242',
        'neutral-dark': '#212121',
        'neutral-light': '#bdbdbd',
      },
    },
  },
  plugins: [],
};
export default config;
