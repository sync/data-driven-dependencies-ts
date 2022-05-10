module.exports = {
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-standard',
    'stylelint-config-prettier',
  ],
  rules: {
    'at-rule-no-unknown': null,
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'declaration-block-no-redundant-longhand-properties': null,
  },
};
