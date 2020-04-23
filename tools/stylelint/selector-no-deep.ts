import {createPlugin, utils} from 'stylelint';

const isStandardSyntaxRule = require('stylelint/lib/utils/isStandardSyntaxRule');
const isStandardSyntaxSelector = require('stylelint/lib/utils/isStandardSyntaxSelector');

const ruleName = 'gngt/selector-no-deep';
const messages = utils.ruleMessages(ruleName, {
  expected: selector => `Usage of the /deep/ in "${selector}" is not allowed`,
});


/**
 * Stylelint plugin that prevents uses of /deep/ in selectors.
 */
const plugin = createPlugin(ruleName, (isEnabled: boolean) => {
  return (root, result) => {
    if (!isEnabled) {
      return;
    }

    root.walkRules(rule => {
      if (rule.parent.type === 'rule' && isStandardSyntaxRule(rule) &&
          isStandardSyntaxSelector(rule.selector) && rule.selector.includes('/deep/')) {
        utils.report({result, ruleName, message: messages.expected(rule.selector), node: rule});
      }
    });
  };
});

plugin.ruleName = ruleName;
plugin.messages = messages;
export default plugin;
