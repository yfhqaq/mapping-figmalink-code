module.exports = {
    sourceType: 'unambiguous',
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    chrome: 100,
                    node: 'current',
                },
            },
        ],
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    plugins: [],
    env: {
        test: {
            plugins: ['@babel/plugin-transform-modules-commonjs'],
        },
    },
};
