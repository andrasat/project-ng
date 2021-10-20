export function utf8ToBase64(value: string) {
  return window.btoa(encodeURIComponent(value));
}

export function base64ToUtf8(value: string) {
  return decodeURIComponent(window.atob(value));
}