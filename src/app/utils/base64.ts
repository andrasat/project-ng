export function utf8ToBase64(value: string) {
  return window.btoa(unescape(encodeURIComponent(value)));
}

export function base64ToUtf8(value: string) {
  return decodeURIComponent(escape(window.atob(value)));
}