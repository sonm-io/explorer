const reactDoc = require('library-utils/react-doc');

const components = {
    'src/components': {
        'elements': [
            'header'
        ]
    }
};

const flatten = (src, prefix, result) => {
    if (src instanceof Array) {
        src.forEach(i => flatten(i, prefix, result));
    } else if (src instanceof Object) {
        for (i in src) {
            if (src.hasOwnProperty(i)) {
                flatten(src[i], `${prefix}${i}/`, result);
            }
        }
    } else if (typeof (src) === 'string') {
        result.push(`${prefix}${src}`);
    }
    return result;
};

module.exports = {
    propsParser: reactDoc, //require('react-docgen-typescript').parse,
    webpackConfig: require('react-scripts-ts/config/webpack.config.dev'),
    //components: 'src/components/**/[A-Za-z]*.tsx'
    //components: flatten(components, '', []).map(i => `${i}/[A-Za-z]*.tsx`) // Comment this, if you want all components to be exposed to styleguidist
}