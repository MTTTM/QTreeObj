import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";
import babel from "rollup-plugin-babel";
export default [{
    input: "src/index.js",
    output: {
        name: "QTreeObj",
        file: "tmp/index.js",
        format: "umd",
        sourcemap: true,
        strict: false,
    },
    plugins: [
        babel({
            exclude: "node_modules/**",
            sourceType: "module",
        }),
        livereload(),
        serve({
            open: true,
            port: 8082,
            contentBase: "",
        }),
    ],
}, ];