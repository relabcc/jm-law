import withData from './withData';

export default (params) => (SubComp) => {
  if (window.__ID !== '000000000') {
    return withData('data/bureaus/laws', params)(SubComp,)
  }
  return withData(`data/bureaus/${window.__ID}/laws`, params)(SubComp)
}
