/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');

module.exports = {
	entry: ['./src/index.ts'],
	output: {
		path: path.join(__dirname, './dist'),
		publicPath: 'auto',
		filename: '[name].[contenthash].js',
		clean: true,
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)?$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: {
					loader: 'url-loader',
					options: {
						publicPath: '/',
						name: '[name].[ext]?[contenthash]',
						limit: 10000,
					},
				},
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};
