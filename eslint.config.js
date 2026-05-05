const js = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'commonjs',
            globals: {
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                URL: 'readonly',
                Buffer: 'readonly',
            },
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'no-console': 0,
            'linebreak-style': 0,
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-var': 'error',
            'prefer-const': 'error',
            'prettier/prettier': [
                'error',
                {
                    trailingComma: 'es5',
                    singleQuote: true,
                    printWidth: 100,
                    tabWidth: 4,
                    semi: true,
                },
            ],
        },
    },
    prettierConfig,
];
