// Generates assets/banner.svg: pixel raindrops fall and settle into the name.
// Run: node scripts/banner.mjs > assets/banner.svg
// CSS animations inside the SVG play when GitHub shows it as an image.

const NAME = 'EZRA KIPLIMO';
const SUB = 'MACHINE LEARNING SCIENTIST · GIS · STATISTICIAN';
const W = 1200;
const H = 300;
const P = 12; // pixel pitch
const RAMP = ['#3fd0f0', '#2a7de1', '#5b4fe0', '#8b5cf6', '#e879f9'];

// 5×7 pixel font, only the letters we need.
const FONT = {
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

// Seeded RNG so the banner is the same every time it is generated.
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (t) => {
  const s = t * (RAMP.length - 1);
  const i = Math.min(RAMP.length - 2, Math.floor(s));
  const a = hex(RAMP[i]);
  const b = hex(RAMP[i + 1]);
  return '#' + a.map((v, k) => Math.round(v + (b[k] - v) * (s - i)).toString(16).padStart(2, '0')).join('');
};

const cols = NAME.length * 6 - 1;
const x0 = Math.round((W - cols * P) / 2);
const y0 = 86;

const pixels = [];
[...NAME].forEach((ch, n) => {
  FONT[ch].forEach((row, y) =>
    [...row].forEach((bit, x) => {
      if (bit !== '1') return;
      const col = n * 6 + x;
      const delay = (0.2 + col * 0.022 + rand() * 0.55).toFixed(2);
      pixels.push(
        `<rect class="p" x="${x0 + col * P}" y="${y0 + y * P}" width="${P - 2}" height="${P - 2}" rx="2" fill="${mix(col / cols)}" style="animation-delay:${delay}s"/>`,
      );
    }),
  );
});

const drizzle = Array.from({ length: 46 }, () => {
  const x = Math.round(rand() * W);
  const dur = (1.4 + rand() * 1.6).toFixed(2);
  const delay = (-rand() * 3).toFixed(2);
  const op = (0.15 + rand() * 0.3).toFixed(2);
  return `<rect class="d" x="${x}" y="-30" width="2" height="${8 + Math.round(rand() * 10)}" fill="#3fd0f0" opacity="${op}" style="animation-duration:${dur}s;animation-delay:${delay}s"/>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Ezra Kiplimo, ${SUB.toLowerCase()}">
<style>
.p{animation:fall .9s cubic-bezier(.2,.8,.3,1) both}
.d{animation:drizzle 2s linear infinite}
.t{animation:fade 1s ease 2.4s both}
.m{font:500 13px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:2px}
@keyframes fall{from{transform:translateY(-160px);opacity:0}50%{opacity:1}to{transform:none;opacity:1}}
@keyframes drizzle{to{transform:translateY(${H + 60}px)}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.p,.t{animation:none}.d{display:none}}
</style>
<defs>
<pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#e8ecf6" stroke-opacity=".05"/></pattern>
<clipPath id="c"><rect width="${W}" height="${H}" rx="18"/></clipPath>
</defs>
<g clip-path="url(#c)">
<rect width="${W}" height="${H}" fill="#090c1c"/>
<rect width="${W}" height="${H}" fill="url(#g)"/>
${drizzle.join('\n')}
${pixels.join('\n')}
<text class="t m" x="${W / 2}" y="222" text-anchor="middle" fill="#97a0b8" style="font-size:17px;letter-spacing:4px">${SUB}</text>
<text class="t m" x="32" y="40" fill="#3fd0f0">IGAD-ICPAC · NAIROBI · 1.29°S 36.82°E</text>
<text class="t m" x="${W - 32}" y="40" text-anchor="end" fill="#97a0b8">ensemble 1/5 · 0.1° grid</text>
<text class="t m" x="${W / 2}" y="${H - 30}" text-anchor="middle" fill="#5b6480">rain made of noise</text>
</g>
</svg>
`;

process.stdout.write(svg);
