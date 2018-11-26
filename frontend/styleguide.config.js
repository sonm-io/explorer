const reactDoc = require('library-utils/react-doc');

module.exports = {
    propsParser: reactDoc, //require('react-docgen-typescript').parse,
    webpackConfig: require('react-scripts-ts/config/webpack.config.dev'),
    //components: 'src/components/**/[A-Z]*.js'
}