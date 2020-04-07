export function d2r(d) {
    var pi = Math.PI;
    return d * (pi/180);
}

export function r2d(r) {
    var pi = Math.PI;
    return r * (180/pi);
}

export function zeroPad(i) {
  
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
