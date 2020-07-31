const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    libraryExport: 'default',
    library: 'lc'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: {
          test: [/node_modules/, /cli/]
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}
