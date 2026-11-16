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

export const dashboard = {
  panel: 'rgba(19,18,22,0.94)', panelBorder: 'rgba(250,248,245,0.10)',
  surface: 'rgba(255,255,255,0.025)', border: 'rgba(250,248,245,0.065)',
  muted: '#B0A7AD', iconSurface: 'rgba(255,255,255,0.045)',
  oliveSurface: '#22281E', oliveBorder: 'rgba(179,201,146,0.24)',
  burgundySurface: '#2C1923', burgundyBorder: 'rgba(201,145,166,0.20)',
  highlight: '#B3C992', terminal: '#00D6A0', radius: 20, gap: 8,
};
