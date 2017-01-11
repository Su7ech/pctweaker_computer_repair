let path = require('path');

const SRC_FILES = {
    pug: path.join(__dirname, '/src/pug/'),
    sass: path.join(__dirname, '/src/scss/'),
    scripts: path.join(__dirname, '/src/scripts/')
};
const BUILD = path.join(__dirname, '/src/build/');

module.exports = {
    context: path.join(__dirname),
    entry: SRC_FILES.scripts + 'index.js',
    output: {
        path: BUILD,
        filename: 'js/script.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    }
};
