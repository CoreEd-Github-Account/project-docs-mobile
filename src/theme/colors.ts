export const brand = {
  burgundy: '#7A0F2E', deepBurgundy: '#5A0B1F', olive: '#556B2F',
  sage: '#8FA779', ivory: '#FAF8F5', gold: '#D4AF7C',
};

export const palettes = {
  light: {
    background: brand.ivory, surface: 'rgba(250,248,245,0.96)', input: '#FFFFFF',
    text: '#1F1F1F', muted: '#606458', border: '#D9D8CD', accent: brand.olive, error: '#AD243C',
  },
  dark: {
    background: '#000000', surface: '#141416', input: '#1C1C1E',
    text: brand.ivory, muted: '#A1A1A6', border: '#38383A', accent: '#B3C992', error: '#FFACB8',
  },
};
