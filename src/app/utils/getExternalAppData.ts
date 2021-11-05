export function getExternalAppData(): false | any {
  try {
    const userAgent = window.navigator.userAgent;
    const externalDataArr = userAgent.split(/\[.*\]/);

    const externalUser = externalDataArr[1] ? JSON.parse(externalDataArr[1]) : null;

    if (!externalUser) {
      return false;
    }

    return externalUser;
  } catch(_) {
    return false;
  }
}