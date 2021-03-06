const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const NotifierPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

console.log('NODE_ENV: ', process.env.NODE_ENV)

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src/main.ts'),
  output: {
    filename: 'js/index.js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: './',
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  module: {
    rules: [
      // 处理js，转es5
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: path.resolve(__dirname, '../src')
      },
      // 处理样式
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
        include: path.resolve(__dirname, '../src')
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      // 处理图片
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      // 处理其他静态资源
      {
        test: /\.(mp4|ogg|mp3|wav)$/i,
        type: 'asset/resource'
      },
      // 支持ts
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        include: path.resolve(__dirname, '../src')
      },
      // 支持vue
      {
        test: /\.vue$/,
        use: ['vue-loader'],
        include: path.resolve(__dirname, '../src')
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  plugins: [
    new HtmlWebpackPlugin({ // html文件处理
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      title: 'webpack5-vue3-prod',
      minify: {
        collapseWhitespace: true, // 去掉空格
        removeComments: true // 去掉注释
      }
    }),
    new CleanWebpackPlugin(), // 清空dist目录
    new MiniCssExtractPlugin({ // 样式代码提取
      filename: 'css/index.css',
      chunkFilename: 'css/[name].[chunkhash:8].css'
    }),
    new VueLoaderPlugin(), // 支持vue
    new NotifierPlugin({ // 打包出错提示
      onErrors: (severity, errors) => {
        if (severity !== 'error') {
          return;
        }
        const error = errors[0];
        notifier.notify({
          title: "Webpack error！！",
          message: severity + ': ' + error.name,
          subtitle: error.file || ''
        });
      }
    }),
    new BundleAnalyzerPlugin({ // 分析包文件大小
      analyzerMode: 'disabled',
      generateStatsFile: true
    })
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({ // 压缩css
        include: /\/src/,
        // sourceMap: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true } // Remove all comments
            }
          ]
        }
      }),
      new TerserPlugin({ // 压缩js
        test: /\.js(\?.*)?$/i,
        include: /\/src/,
        parallel: true
      })
    ]
  },
  cache: { // 打包使用缓存
    type: 'filesystem'
  }
}