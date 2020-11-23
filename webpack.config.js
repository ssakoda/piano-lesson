var debug   = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path    = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = (env) => { 
  return {
  context: path.join(__dirname, "src"),
  entry: {
    index: ["./js/index.js"],
    login: ["./js/login.js"]
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader'
          /*,
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
          */
        }]
      },{
        test: /\.(scss|css)$/,
        include: [
          path.resolve(__dirname, "src", "css"), 
          path.resolve(__dirname, "node_modules/react-datepicker/dist/"),
          path.resolve(__dirname, 'node_modules/react-tabs/style/')
        ],
        //exclude: /(node_modules|bower_components)/,
        use: [{loader: 'style-loader'},{loader: 'css-loader?sourceMap'}]
      }]
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js"
    },
    plugins: [
      new webpack.DefinePlugin({"process.env.API_URL": JSON.stringify((process.env && process.env.API_URL) ? process.env.API_URL : (env ? env.API_URL : []))}),
      //new webpack.optimize.OccurrenceOrderPlugin(true),
      //new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html"),
        filename: "index.html",
        chunks: ["index"],
        inject: true
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "login.html"),
        filename: "login.html",
        chunks: ["login"],
        inject: true
      }),
    ]
    ,
    devServer: {
        contentBase: __dirname + '/dist/',
        host: '0.0.0.0',
        disableHostCheck: true
    }
}};