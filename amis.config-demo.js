'use strict';
const path = require('path');
function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  settings: {
    enableESLint: false, // 调试模式是否开启ESLint，默认开启ESLint检测代码格式
    enableESLintFix: false, // 是否自动修正代码格式，默认不自动修正
    enableStyleLint: false, // 是否开启StyleLint，默认开启ESLint检测代码格式
    enableStyleLintFix: false // 是否需要StyleLint自动修正代码格式
  },
  webpack: {
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.umd.js', '.min.js', '.json'], // 用于配置webpack在尝试过程中用到的后缀列表
      alias: {
        '@': resolve('src'),
        $assets: resolve('src/assets'),
        $public: resolve('public'),
      },
    },
    plugins: [
      new CustomWebpackPlugin()
    ],
    moduleRules: [
      {
        test: /\.(js|vue|css|html)$/,
        loader: 'params-replace-loader',
        options: projectConfig.envParams
       }
    ],
    babelPlugins: (curBabelPlugins) => {
      // 剔除掉 babel-plugin-import，antd5 不需要
      curBabelPlugins.shift();

      // 支持 element-ui 组件按需引入（借助 babel-plugin-component）
      curBabelPlugins.push([
        "component",
        {
          "libraryName": "element-ui",
          "styleLibraryName": "theme-chalk"
        }
      ]);
    }
  },
  dev: {
    entry: { // 本地编辑器中预览自定义组件
      index: [
        './src/index.js', // widget/info-card.jsx
        './src/widget/plugin/info-card-plugin.jsx',
      ],
    },
    // 用于开启本地调试模式的相关配置信息
    NODE_ENV: 'development',
    port: 80,
    assetsPublicPath: '/', // 设置静态资源的引用路径（根域名+路径）
    assetsSubDirectory: '',
    hostname: 'localhost',
    proxyTable: {
      '/apiTest': {
        target: 'http://api-test.com.cn', // 不支持跨域的接口根地址
        ws: true,
        changeOrigin: true
      }
    },
    cssSourceMap: true,
    closeHotReload: false, // 是否关闭热更新
    // closeEditorClient: false, // 是否关闭自动注入editor
    autoOpenBrowser: true,
    // editorClient: 'aipage'
  },
  preview: {
    entry: { // 本地预览自定义组件内容
      index: './src/preview.js',
    },
    // 用于开启本地调试模式的相关配置信息
    NODE_ENV: 'development',
    port: 80,
    assetsPublicPath: '/', // 设置静态资源的引用路径（根域名+路径）
    assetsSubDirectory: '',
    hostname: 'localhost',
    proxyTable: {
      '/apiTest': {
        target: 'http://api-test.com.cn', // 不支持跨域的接口根地址
        ws: true,
        changeOrigin: true
      }
    },
    cssSourceMap: true,
    closeHotReload: false, // 是否关闭热更新
    autoOpenBrowser: true,
  },
  linkDebug: {
    entry: { // 外链调试（amis-saas中预览自定义组件）
      index: [
        './src/index.js', // widget/info-card.jsx
        './src/widget/plugin/info-card-plugin.jsx',
      ],
    },
    // 用于开启本地调试模式的相关配置信息
    NODE_ENV: 'development',
    port: 80,
    assetsPublicPath: '/', // 设置静态资源的引用路径（根域名+路径）
    assetsSubDirectory: '',
    hostname: 'localhost',
    proxyTable: {
      '/apiTest': {
        target: 'http://api-test.com.cn', // 不支持跨域的接口根地址
        ws: true,
        changeOrigin: true
      }
    },
    cssSourceMap: true,
    closeHotReload: true, // 是否关闭热更新
    autoOpenBrowser: false,
    closeHtmlWebpackPlugin: true, // 关闭HtmlWebpackPlugin
  },
  build2lib: {
    entry: {
      // 自定义组件入口文件
      reactInfoCard: './src/index.js', // widget/info-card.jsx
      reactInfoCardPlugin: './src/widget/plugin/info-card-plugin.jsx'
    },
    // 用于构建生产环境代码的相关配置信息
    NODE_ENV: 'production',
    libraryName: 'amisWidget', // 构建第三方功能包时最后导出的引用变量名
    assetsRoot: resolve('./dist'), // 打包后的文件绝对路径（物理路径）
    assetsPublicPath: './', // 设置静态资源的引用路径（根域名+路径）
    assetsSubDirectory: '', // 资源引用二级路径
    ignoreNodeModules: true, // 打包时是否忽略 node_modules
    allowList: ['catl-components/dist/esm/cards/CrandPurchaseCard/index.less'], // ignoreNodeModules为true时生效
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css', 'json'],
    bundleAnalyzerReport: false,
  }
};
