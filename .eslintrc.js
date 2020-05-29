module.exports = {
    root: true,
    env: {
        node: true,
    },
    'globals': {
        '_': true,
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard',
    ],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        'no-debugger': 'off',
        'no-console': 'off',
        'prefer-const': 'off',
        'no-unused-vars': [
            'error',
            {
                'vars': 'all',
                'args': 'after-used',
                'ignoreRestSiblings': true,
            },
        ],
        'indent': ['error', 4],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', {
            'arrays': 'always-multiline',
            'objects': 'always-multiline',
            'imports': 'always-multiline',
            'exports': 'always-multiline',
            'functions': 'ignore',
        }],
        'standard/no-callback-literal': 0,
        'no-trailing-spaces': 0,
        'quote-props': 0,
    },
    'overrides': [
        {
            'files': ['*.vue'],
            'rules': {
                'indent': 'off',
                'vue/script-indent': ['error', 4, {
                    'baseIndent': 1,
                    'switchCase': 1,
                }],
            },
        },
    ],
};
