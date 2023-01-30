export const isMobileDevice = () => {
  if (!window?.navigator?.userAgent) {
    console.error('useAgent is not defined. Error in isMobileDevice');

    return null;
  }

  return window.navigator.userAgent.indexOf(
    '/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i'
  );
};
