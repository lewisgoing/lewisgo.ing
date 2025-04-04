// tailwind.config.js update
const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
    './data/**/*.mdx',
  ],
  variants: {
    extend: {
      grayscale: ['hover'],
    },
  },
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },

    extend: {
      screens: {
        'bento-sm': '374px',
        'bento-md': '799px',
        'bento-lg': '1199px',
        'bento-xl': '1599px',
        sm: '374px',
        md: '799px',
        lg: '1199px',
        'xl': '1599px',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        // Enable JetBrains Mono as sans font
        sans: ['var(--font-inter)', ...fontFamily.sans],
        mono: ['var(--font-jetbrains-mono)', ...fontFamily.mono],
      },
      colors: {
        instagram: '#E4405F',
        linkedin: '#0E76A8',
        github: '#24292E', // #2b3137 for lighter dark or #2dba4e for the green one
        soundcloud: '#FF7700',
        gray: colors.gray,
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          // DocSearch colors
          400: 'hsl(var(--primary))',
          500: 'hsl(var(--primary))',
          600: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        tertiary: {
          DEFAULT: 'hsl(var(--tertiary))',
          foreground: 'hsl(var(--tertiary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        gradient: 'gradient 6s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        skeleton: 'skeleton 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                filter: 'brightness(1.10)',
              },
              code: { color: theme('colors.primary.DEFAULT') },
            },
            p: {
              fontSize: '14px',
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            pre: {
              fontSize: '14px !important',
            },
            code: {
              color: theme('colors.primary.DEFAULT'),
              fontSize: 'inherit',
              fontWeight: '400',
              backgroundColor: theme('colors.primary.foreground'),
              borderWidth: '1px',
              borderColor: theme('colors.border'),
              fontFamily: 'var(--font-jetbrains-mono)',
              borderRadius: '0.25rem',
              padding: '0.25rem 0.5rem',
            },
            'code::before': {
              display: 'none',
            },
            'code::after': {
              display: 'none',
            },
            img: {
              display: 'block',
              borderRadius: '0.5rem',
              borderWidth: '1px',
              borderColor: theme('colors.border'),
              margin: '1.5rem auto !important',
            },
            blockquote: {
              color: theme('colors.muted.foreground'),
              quotes: 'none',
              fontStyle: 'normal',
              borderLeftColor: theme('colors.border'),
            },
            hr: {
              borderColor: theme('colors.border'),
            },
            tr: {
              borderColor: theme('colors.border'),
            },
            thead: {
              borderColor: theme('colors.border'),
            },
            'li::marker': {
              color: theme('colors.muted.foreground'),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                filter: 'brightness(1.10)',
              },
              code: { color: theme('colors.primary.DEFAULT') },
            },
            p: {
              fontSize: '14px',
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
  darkMode: 'class',
};