// webpack設置
// 安裝--> npm install --save-dev webpack
// 運行--> 在package.json中的scripts配置"build": "webpack"
const webpack = require('webpack');

// path是node.js中的路徑套件
const path = require('path');

// html-webpack-plugin插件可以協助自動產生html檔案，並將打包完成的js自動引用進去
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 因開發時第三方庫通常很久才會更新一次，
// 所以為增進效能，將第三方庫整合成vendor.js，
// 使用者第一次造訪網頁時仍需下載，
// 但有下載過後，瀏覽器緩存會有紀錄，
// 使用者第二次訪問網頁時就不需要下載。
// const VENDOR_LIBS = [
//     'lodash',
//     'react',
//     'react-dom',
//     'react-redux',
//     'react-router',
//     'redux',
//     'redux-form',
//     'redux-thunk'
// ];

const config = {
    // 入口文件(使用相對路徑)
    // entry: './src/index.js',
    entry: {
        bundle: './src/index.js',
        // vendor: VENDOR_LIBS
    },
    // 輸出文件(使用絕對路徑)
    output: {
        // __dirname是node.js中的常數，它是對當前工作目錄的引用
        // path.resolve，此函數指定了文件路徑，讓不管是在Windows、Linux、Mac等平台上，都可以正確的指定路徑
        path: path.resolve(__dirname, 'dist'),
        // filename: 'bundle.js'  如果entry不是物件可使用，否則使[name].js，會自動對應物件key值
        //           [chunkhash]  自動產生唯一值，讓瀏覽器緩存發現與前次下載之js不同而重新下載(只有檔案變更時才會觸發)
        filename: '[name].[chunkhash].js',
        publicPath: 'dist/', // 此webpack參數作用: 1.url-loader會將此路徑放置最前方
    },
    module: {
        // rules陣列--> 建置各個loader 
        rules: [
            {
                // 1.babel-loader: 告訴babel如何和webpack協作
                // 2.babel-core: babel的核心，它知道如何獲取javaScript code
                // 3.babel-preset-env: 告訴babel如何將ES6轉換成ES5
                // 4.babel-preset-react: 轉換jsx --> 純js
                use: 'babel-loader',
                test: /\.js$/,
                // 告訴webpack不要執行babel到位於node_modules目錄內的任何文件，我們沒有必要去將node_modules內的文件轉換成E55
                exclude: /node_modules/

                // babel設置
                // 為了讓babel切確知道它應該對每個文件做什麼(ex: 載入babel-preset-env)
                // 1.在專案根目錄創建.babelrc
                // 2.設置.babelrc
                //  {
                //      在presets陣列中放置我們期望babel運行的code
                //      "presets": ["babel-preset-env"]
                //  }
            },
            {
                // 1.css-loader: 告訴webpack如何import和讀取css
                //    css打包方法 1
                //    2.style-loader: 告訴webpack如何將css放入html(會轉換成<style> css </style>放置到html head)
                // <--- loader是從陣列的右方開始讀取至左方
                use: ['style-loader', 'css-loader'],
                test: /\.css$/
            },
            {
                // 圖片打包
                // 1.image-webpack-loader: 壓縮圖片大小
                // 2.url-loader: 圖片較大--> Include the image in bundle.js as raw data
                //               圖片較小--> Include the raw image in the output directory
                // <--- loader是從陣列的右方開始讀取至左方
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4000 // --> 檢查圖像是否大於40kb
                        }
                    },
                    'image-webpack-loader'
                ],
                test: /\.(png|jpe?g|gif|svg)$/
            }
        ]
    },
    plugins: [
        // CommomsChunkPlugin插件可以告訴webpack如果entry拆分的檔案(ex: bundle、vendor)有重複的依賴項，
        // 就將他們拉出來並只加在name設定的檔案中。

        // manifest參數會產生manifest.js，此js會告訴瀏覽器vendor是否有改變，沒有的話不下載(有加[chunkhash]必須要加，因為webpack並不知道我們是否有更改vendor)

        // 因為chunkhash會導致dist目錄中的檔案名稱不重複，進而導致檔案不會被覆蓋並且越來越多，
        // 所以要npm i rimraf --save-dev安裝rimraf來清理。
        // rimraf scripts
        // "clean": "rimraf dist"
        // "build": "npm run clean && webpack"

        // optimize --> 意旨優化
        // new webpack.optimize.CommomsChunkPlugin({
        //     names: ['vendor', 'manifest']
        // }),

        // webpack4開始已不支援CommomsChunkPlugin，更改為splitChunks。
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        // webpack.DefinePlugin是用來在bundle.js中產生window全域變數的插件，
        // 當react讀取到'process.env.NODE_ENV'時，就不會跑出錯誤訊息。
        // "build": "NODE_ENV=production npm run clean && webpack -p" <-- 最後面的-p代表生產版本，webpack看到-p時會自動壓縮js
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    optimization: {
        // splitChunks
        // async：只處理 Lazy Loading 的 chunks，例如 import(xxx) 語法載入的模組
        // initial：只處理同步加載的 chunk，例如 import xxx 語法載入的模組
        // all：兼容以上兩種方式，通通進行處理
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    name: 'vendors',
                }
            }
        },
    },
    mode: 'development',
};

module.exports = config;

// 靜態網站部屬
// Surge.sh
// Github Pages
// AWS <-- 要仔細看收費方式

// 動態網站部屬
// Heroku
// AWS