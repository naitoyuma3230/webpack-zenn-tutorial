// node installしたcross-envにより環境変数NODE_ENVによって処理を分岐できる
const isDev = process.env.NODE_ENV === "development";
// Node.js の path モジュール,絶対パスの取得
const path = require("node:path");
/** @type {import('webpack').Configuration} */
module.exports = {
	// modeをNODE_ENVで設定
	mode: isDev ? "development" : "production",
	// 依存関係解決に参照するファイルの拡張子を指定
	// .jsxファイルも追加で参照する
	resolve: {
		extensions: [".js", ".json", ".jsx"],
	},
	// エントリーポイントの指定
	entry: {
		// チャンク名:app
		app: "./src/index.jsx",
	},
	// 出力先を指定
	output: {
		// ファイル名 [name]でチャンク名:appを使用可能
		filename: "[name].js",
		// 出力するフォルダ
		path: path.resolve(__dirname, "dist"),
	},
	// ソースマップの有無
	devtool: isDev ? "source-map" : undefined,
	// dev-serverを設置した時の参照先
	devServer: {
		static: {
			directory: "./dist",
		},
	},
	module: {
		rules: [
			{
				// 拡張子 js のファイル（正規表現）
				test: /\.js$/,
				test: /\.jsx$/,
				// ローダーの単体指定
				// .jsxを追加したら、.babelrcのpresetもjsxをインストールする必要あり
				loader: "babel-loader",
			},
			{
				// cssのローダーに関するルール
				// scssも含めた正規表現
				test: /\.s?css$/,
				// 複数のローダーはuseで指定、注意点として配列最後から順番に適応される
				// use: ["style-loader", "css-loader"],
				// ソースマップ作成のoption追加
				// style-loaderは共通、css-loader、sass-loaderにそれぞれoption指定
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							// dev モードではソースマップを付ける
							sourceMap: isDev,
						},
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: isDev,
						},
					},
				],
			},
		],
	},
};
