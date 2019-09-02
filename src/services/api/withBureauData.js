import withData from './withData';

export default (SubComp) => {
  if (window.__ID !== '000000000') {
    return withData('data/bureaus')(SubComp)
  }
  return withData(`data/bureaus/${window.__ID}`)(SubComp)
}
