/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/vehicle/': {
      target: 'http://124.70.218.110:9002',
      changeOrigin: true,
      pathRewrite: { '^/vehicle': '/api/vehicle' },
    },
    '/dispatch/': {
      target: 'http://124.70.218.110:9002',
      changeOrigin: true,
      pathRewrite: { '^/dispatch': '/dispatch' },
    },
    '/ota/': {
      target: 'http://124.70.218.110:9002',
      changeOrigin: true,
      pathRewrite: { '^/ota': '/ota' },
    },
    '/api/': {
      target: 'http://124.70.218.110:9002',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
    '/profile/avatar/': {
      target: 'http://124.70.218.110:9002',
      changeOrigin: true,
      pathRewrite: { '^/profile/avatar/': '/web/profile/avatar/' },
    },
    '/closure/': {
      target: 'http://124.70.218.110:9002',
      changeOrigin: true,
      pathRewrite: { '^/closure/': '/data-closure/' },
    },
    '/sts': {
      target: 'http://127.0.0.1:9000',
      changeOrigin: true,
      pathRewrite: { '^/': '/' },
    },
    '/operationApi': {
      //target: 'http://124.70.218.110:9001',
      target: 'http://localhost:4095',
      changeOrigin: true,
      pathRewrite: { '^/operationApi': '/' }
    }
  },
};
