const { hsv2rgb } = require("blinkt-utils");

const spacing = 360.0 / 16;
let hue = 0;
let i = 0;

const rainbow = blinkt => {
  const cancelMe = setInterval(() => {
    hue = i % 360;
    for (let x = 0; x < 8; x++) {
      const offset = x * spacing;
      const h = (hue + offset) % 360;
      const [r, g, b] = hsv2rgb(h, 1, 1);
      blinkt.setPixel({ pixel: x, r, g, b });
    }
    blinkt.show();
    if (i > 359) {
      i = 0;
    } else {
      i += 0.33;
    }
  }, 0);
  return () => clearInterval(cancelMe);
};

module.exports = {
  rainbow: rainbow
};
