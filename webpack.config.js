// node installしたcross-envにより環境変数NODE_ENVによって処理を分岐できる
const isDev = process.env.NODE_ENV === "development";
// Node.js の path モジュール,絶対パスの取得
const path = require("node:path");
// htmlもWebpackのsrcに含めてバンドルするmodule読み込み
const HtmlWebpackPlugin = require("html-webpack-plugin");
// SEOやセキュリティ上CSSをインラインで記述する事が推奨されない場合がある
// style-loaderの拡張番を読み込む
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
	// ソースマップの有無
	devtool: isDev ? "source-map" : undefined,
	// 出力先を指定
	output: {
		// ファイル名 [name]でチャンク名:appを使用可能
		filename: "[name].js",
		// 出力するフォルダ
		path: path.resolve(__dirname, "dist"),

		// type:assetsの出力設定、 "dist/asset/名前.拡張子" として出力される
		assetModuleFilename: "asset/[name][ext]",
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
					// "style-loader",の代わりに拡張番を使用
					MiniCssExtractPlugin.loader,
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
			{
				// 画像やフォントファイル
				// type:assetを指定すると、jsファイル以外へのバンドルが可能となる
				// これはバンドルの際に時間がかかる画像やフォントのためのオプション
				test: /\.(ico|png|svg|ttf|otf|eot|woff?2?)$/,
				type: "asset",
				// asset/inlineとasset/resourceの自動切り替え
				parser: {
					dataUrlCondition: {
						// 2kb 以上なら `asset/resource`（js化せず別ファイルとしてバンドル） する
						maxSize: 1024 * 2,
					},
				},
			},
		],
	},
	// pluginsの利用
	// ここで設定したhtmlファイルにバンドルされたjsを読み込み表示する
	plugins: [
		// プラグインのインスタンスを作成
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			// テンプレートとなる元ファイル(html)
			template: "./src/index.html",
			// <script> ~ </script> タグの挿入位置
			inject: "body",
			// スクリプト読み込みのタイプ
			scriptLoading: "defer",
			// ファビコンも <link rel="shortcut icon" ~ /> として挿入できる
			// favicon: "./src/favicon.ico",
		}),
	],
	// dev-serverを設置した時の参照先
	devServer: {
		static: {
			directory: "./dist",
		},
	},
};
