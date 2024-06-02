const path = require('path')
const nodeExternals = require('webpack-node-externals')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
    entry: './src/server.ts',
    resolve: {
        plugins: [new TsconfigPathsPlugin()],
        extensions: ['.ts', '.js']
    },
    target: 'node',
    devtool: 'eval',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: function (modulePath) {
                    return modulePath.endsWith('.ts') && !modulePath.endsWith('test.ts')
                },
                loader: 'ts-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    }
}