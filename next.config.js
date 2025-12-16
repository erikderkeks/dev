const repo = 'dev-page'

module.exports = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,

  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
}
