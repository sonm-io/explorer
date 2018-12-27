'use strict';

const paths = require('./paths');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;

// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// Note: defined here because it will be used more than once.
const cssFilename = "static/css/[name]-css.[contenthash:8].css";
const lessCssFilename = "static/css/[name]-less.[contenthash:8].css";

// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const getPublicPath = function(filePath) {
  return shouldUseRelativeAssetPaths && false
    ? // Making sure that the publicPath goes back to to build folder.
      { publicPath: Array(filePath.split("/").length).join("../") }
    : {};
};

const extractCssPlugin = new ExtractTextPlugin(cssFilename);
const extractLessPlugin = new ExtractTextPlugin(lessCssFilename);

const fallback = {
    loader: require.resolve("style-loader"),
    options: {
      hmr: false
    }
  };

const cssLoader = {
    loader: require.resolve("css-loader"),
    options: {
      importLoaders: 1,
      minimize: true,
      sourceMap: shouldUseSourceMap
    }
  };

const postCssLoader = {
    loader: require.resolve("postcss-loader"),
    options: {
      // Necessary for external CSS imports to work
      // https://github.com/facebookincubator/create-react-app/issues/2677
      ident: "postcss",
      plugins: () => [
        require("postcss-flexbugs-fixes"),
        autoprefixer({
          browsers: [
            ">1%",
            "last 4 versions",
            "Firefox ESR",
            "not ie < 9" // React doesn't support IE8 anyway
          ],
          flexbox: "no-2009"
        })
      ]
    }
  };

const extractCss = Object.assign(
  {
    fallback,
    use: [ cssLoader, postCssLoader ]
  },
  getPublicPath(cssFilename)
);

const extractLess = Object.assign(
  {
    fallback,
    use: [
      cssLoader,
      {
        loader: "less-loader"
      },
      postCssLoader
    ]
  },
  getPublicPath(cssFilename)
);

module.exports = {
    // Css
    extractCssPlugin,
    extractCss,
    // Less
    extractLessPlugin,
    extractLess
};
