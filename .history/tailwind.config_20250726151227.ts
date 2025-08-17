import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // الخطوط العربية
        'tajawal': ['Tajawal', 'sans-serif'],
        'cairo': ['Cairo', 'sans-serif'],
        'amiri': ['Amiri', 'serif'],
        'noto': ['Noto Sans Arabic', 'sans-serif'],
        
        // الخطوط الإنجليزية
        'inter': ['Inter', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        
        // الخط الافتراضي
        'default': ['Tajawal', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
  colors: {
  // ذهبي دافئ للعناصر المهمة
  lamaSky: "#D2B48C",
  lamaSkyLight: "#F0E6D6",
  
  // بيج كريمي للخلفيات
  lamaPurple: "#F7F3EE",
  lamaPurpleLight: "#FCFAF8",
  
  // بني ذهبي للنصوص
  lamaYellow: "#B8956A",
  lamaYellowLight: "#E2D5C7",
},
      keyframes: {
        slide: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        slide: "slide 20s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;