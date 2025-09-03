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
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        'accent-dark': 'var(--color-accent-dark)',
        neutral: 'var(--color-neutral)',
        'neutral-dark': 'var(--color-neutral-dark)',
        'neutral-light': 'var(--color-neutral-light)',
      },
    },
  },
  plugins: [],
};
export default config;