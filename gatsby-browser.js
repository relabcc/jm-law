/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import wrapWithProvider from './with-provider';

window.__ID = '00000000'
if (window.location.search) {
  const res = /bureauId=([^&]+)/g.exec(window.location.search)
  if (res && res[1]) {
    window.__ID = decodeURIComponent(res[1])
  }
}
export const wrapRootElement = wrapWithProvider;
