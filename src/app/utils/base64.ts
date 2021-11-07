export function utf8ToBase64(value: string) {
  return window.btoa(encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
}

export function base64ToUtf8(value: string) {
  return decodeURIComponent(Array.prototype.map.call(window.atob(value), c => {
    return '%' + `00${c.charCodeAt(0).toString(16)}`.slice(-2);
  }).join(''));
}