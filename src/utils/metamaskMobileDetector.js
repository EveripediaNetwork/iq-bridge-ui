function isMetamaskMobileAndIframe() {
  try {
    const isIframe = window.self !== window.top;
    if (isIframe) {
      const { userAgent } = window.navigator;
      if (
        userAgent &&
        (userAgent ===
          "Mozilla/5.0 (Linux; Android 10; Android SDK built for x86 Build/OSM1.180201.023) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.92 Mobile Safari/537.36" ||
          userAgent ===
            "Mozilla/5.0 (iPhone; CPU iPhone OS 13_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/76.0.3809.123 Mobile/15E148 Safari/605.1" ||
          userAgent.includes("TokenPocket"))
      ) {
        window.parent.location.href = window.self.location.href;
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

export { isMetamaskMobileAndIframe };
