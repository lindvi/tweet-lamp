function calculateCurrentColor(callback) {
    var red = (rgb.red > 0.04045) ? Math.pow((rgb.red + 0.055) / (1.0 + 0.055), 2.4) : (rgb.red / 12.92);
    var green = (rgb.green > 0.04045) ? Math.pow((rgb.green + 0.055) / (1.0 + 0.055), 2.4) : (rgb.green / 12.92);
    var blue = (rgb.blue > 0.04045) ? Math.pow((rgb.blue + 0.055) / (1.0 + 0.055), 2.4) : (rgb.blue / 12.92); 

    var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
    var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
    var Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;

    var x = X / (X + Y + Z);
    var y = Y / (X + Y + Z);

    rgb.x = x;
    rgb.y = y;

    if (typeof callback === 'function') {
      callback();    
  }
}

var rgb = {
  red: 0,
  green: 0,
  blue: 1,
  x: 0,
  y: 0
};

module.exports = {
    calculateCurrentColor: calculateCurrentColor,
    rgb: rgb
};