const nodeResolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const swc = require("@rollup/plugin-swc")

function postprocess() {
    return {
        name: 'postprocess', // this name will show up in logs and errors
        generateBundle: (options, bundle) => {
            bundle['bundle.js'].code = bundle['bundle.js'].code + ";return bundle()"
        }
    };
}

exports.default = {
    input: 'src/main.js',
    output: {
        file: 'bundle.js',
        format: 'iife',
        name: "bundle",
        plugins: [terser({
            compress: false,
            format: {
                comments: false
            }
        })]
    },
    plugins: [nodeResolve(), swc({
        include: "*/**/*.ts",
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