export function utf8ToBase64(value: string) {
  return window.btoa(value);
}

export function base64ToUtf8(value: string) {
  return window.atob(value);
}