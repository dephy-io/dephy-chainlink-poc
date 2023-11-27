const nodeResolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const swc = require("@rollup/plugin-swc")

function postprocess() {
    return {
        name: 'postprocess', // this name will show up in logs and errors
        generateBundle: (options, bundle) => {
            bundle['main.js'].code = bundle['main.js'].code + "\n return bundle()"
        }
    };
}

exports.default = {
    input: 'src/main.js',
    output: {
        file: 'dist/main.js',
        format: 'iife',
        name: "bundle",
        plugins: [terser({
            compress: false,
            format: {
                comments: false
            }
        })]
    },
    plugins: [nodeResolve({
        extensions: ['.ts', '.mjs', '.js', '.json', '.node']
    }), swc({
        swc: {
            jsc: {
                parser: {
                    syntax: "typescript"
                },
                target: "esnext",
                loose: true
            },
            minify: true
        }
    }), postprocess()]
};