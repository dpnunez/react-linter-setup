#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const { TS_NAME, JS_NAME, CRA_NAME, NEXT_NAME } = require('./constants')

module.exports = function (answers) {
  const isTs = answers.language === TS_NAME;
  const isNext = answers.framwork === NEXT_NAME;

  const dependenciesTs = [
    '@typescript-eslint/eslint-plugin@^5.9.0',
    '@typescript-eslint/parser@^5.9.0',
    'eslint-import-resolver-typescript@^2.5.0',
  ];
  const dependenciesNext = [];
  const dependencies = [
    'eslint@^8.6.0',
    'eslint-config-airbnb@^19.0.4',
    'eslint-config-prettier@^8.3.0',
    'eslint-plugin-import@^2.25.3',
    'eslint-plugin-jsx-a11y@^6.5.1',
    'eslint-plugin-prettier@^4.0.0',
    'eslint-plugin-react@^7.28.0',
    'eslint-plugin-react-hooks@^4.3.0',
    'prettier@^2.5.1',
    ...(isTs ? dependenciesTs : []),
    ...(isNext ? dependenciesNext : []),
  ];

  const configEslint = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'plugin:react/recommended',
      'airbnb',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
    rules: {
      'prettier/prettier': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-filename-extension': [
        1,
        {
          extensions: [isTs ? '.tsx' : '.jsx'],
        },
      ],
      ...(isTs && {
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            ts: 'never',
            tsx: 'never',
          },
        ],
        '@typescript-eslint/no-use-before-define': ['error'],
      }),
      'no-use-before-define': 'off',
      'react/react-in-jsx-scope': 'off',
    },
    ...(isTs && {
      settings: {
        'import/resolver': {
          typescript: {},
        },
      },
      parser: '@typescript-eslint/parser',
    }),
  };

  const configPrettier = `module.exports = {
    singleQuote: true, 
    trailingComma: 'all',
    arrowParens: 'avoid',
  }`;

  const eslintIgnore = `
  **/*.js
  node_modules
  build
  /src/react-app-env.d.${isTs ? 'ts' : 'js'}
  /src/reportWebVitals.${isTs ? 'ts' : 'js'}
  `;

  function installDeps() {
    console.log('🔗 Instalando dependencias');
    exec(`${answers.manager} add -D ${dependencies.join(' ')}`, { shell: true }, error => {
      if (error) {
        console.error(`Erro na instalaçao das dependencias: ${error}`);
        return;
      }
      createConfigFiles();
    });
  }

  function createConfigFiles() {
    console.log( '📂 Criando arquivos de configuração');
    fs.writeFileSync('.eslintrc.json', JSON.stringify(configEslint, null, 2));
    fs.writeFileSync('prettier.config.js', configPrettier);
    fs.writeFileSync('.eslintignore', eslintIgnore);
    removeTrash();
  }

  function removeTrash() {
    console.log( '🗑 Removendo configurações prévias');
    fs.readFile('package.json', 'utf-8', function (err, data) {
      const parsedPackage = JSON.parse(data);
      delete parsedPackage.eslintConfig;
      fs.writeFileSync(
        'package.json',
        JSON.stringify(parsedPackage, null, 2),
      );
    });
  }

  installDeps();
}

