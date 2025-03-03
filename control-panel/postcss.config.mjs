import postcssImport from 'postcss-import'
import tailwindcss from 'tailwindcss'
import postcssNested from 'postcss-nested'
import autoprefixer from 'autoprefixer'

const config = {
  plugins: [
    postcssImport,
    tailwindcss,
    postcssNested,
    autoprefixer,
  ],
};
export default config;
