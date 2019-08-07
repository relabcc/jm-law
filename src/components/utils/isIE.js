import Bowser from 'bowser';

let isIE;
if (typeof window !== 'undefined') {
  const browser = Bowser.getParser(window.navigator.userAgent);
  isIE = browser.getBrowserName() === 'Internet Explorer';
}

export default isIE
