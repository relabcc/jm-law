const hostname = 'relabcc.github.io';
const pathPrefix = 'jm-law';

module.exports = {
  siteMetadata: {
    title: '法制局',
    description: '法制局儀錶板',
    url: `https://${hostname}/${pathPrefix}`,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
  ],
  pathPrefix,
}
