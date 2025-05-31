module.exports = {
    module: {
        rules: [
            {
                test: /\.[jt]s$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['istanbul']
                    }
                }
            }
        ]
    }
};  