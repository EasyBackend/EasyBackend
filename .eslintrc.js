module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "prettier",
    "plugin:@typescript-eslint/eslint-recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "import/prefer-default-export": 0,
    "consistent-return": 0,
    "prefer-destructuring": 0,
    "no-underscore-dangle": 0,
    "no-param-reassign": 0,
    "no-unused-vars": "off",
    "prefer-template": 2,
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/no-var-requires": 0,
    "import/no-extraneous-dependencies": 1,
    "no-useless-return": 0,
    "no-shadow": 0,
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        semi: false,
        printWidth: 120,
      },
    ],
  },
};
