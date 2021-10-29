function isMetamaskMobileAndIframe() {
  try {
    const isIframe = window.self !== window.top;
    if (isIframe) {
      const { userAgent } = window.navigator;
      if (userAgent) {
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
