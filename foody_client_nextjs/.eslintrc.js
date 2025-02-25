module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  plugins: ['import', '@typescript-eslint', 'prettier', 'react'],
  extends: [
    'eslint:recommended',
    'plugin:import/typescript',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@next/next/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'prettier'
  ],
  rules: {
    // Prettier 규칙을 ESLint 오류로 표시
    'prettier/prettier': ['error', {
      'singleQuote': true,
      'semi': true,
      'tabWidth': 2,
      'trailingComma': 'es5',
      'printWidth': 100
    }],
    
    // override configuration set by extending "eslint:recommended"
    'no-cond-assign': 'off',
    'no-control-regex': 'off',
    'no-debugger': 'off',
    'no-empty': 'off',
    'no-ex-assign': 'off',
    'no-extra-boolean-cast': 'off',
    'no-extra-semi': 'off',
    'no-fallthrough': 'off',
    'no-irregular-whitespace': 'off',
    'no-loss-of-precision': 'off',
    'no-misleading-character-class': 'off',
    'no-mixed-spaces-and-tabs': 'off',
    'no-octal': 'off',
    'no-regex-spaces': 'off',
    'no-setter-return': 'off',
    'no-sparse-arrays': 'off',
    'no-undef': 'off',
    'no-unreachable': 'off',
    'no-unsafe-finally': 'off',
    'no-useless-backreference': 'off',
    'no-useless-catch': 'off',
    'valid-typeof': 'off',
    'no-case-declarations': 'off',
    // custom setting
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', argsIgnorePattern: '_|req|res|next' }],
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/tsx-props-no-spreading': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    // override configuration set by extending "import/*"
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: '{react,react-dom,next,next/*}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@@*/**',
            group: 'internal',
            patternOptions: { partial: true, nocomment: true },
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'react-dom', 'next'],
        alphabetize: { order: 'asc' },
        'newlines-between': 'always',
      },
    ],
    'import/no-unresolved': 'off',
    'import/namespace': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/named': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    // 추가 포맷팅 규칙
    'indent': ['error', 2],
    'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    // React 관련 규칙 강화
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/react-in-jsx-scope': 'error',
    'react/jsx-no-undef': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};