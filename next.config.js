const repo = 'dev'

module.exports = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,

  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
}
