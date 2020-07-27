const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    context: process.cwd(), // 上下文
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'monitor.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        // before是用来配置路由的， 
        before(router) {
            router.get('/success',function(req,res) {
                res.json({id: 1})
            })
            router.post('/error',function(req,res) {
                res.sendStatus(500)
            })
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'head'  // 将js脚本注入到头部，因为要先执行。
        })
    ]
}