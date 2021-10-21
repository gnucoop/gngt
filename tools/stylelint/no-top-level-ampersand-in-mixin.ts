import {basename} from 'path';
import {createPlugin, utils} from 'stylelint';

const ruleName = 'gngt/no-top-level-ampersand-in-mixin';
const messages = utils.ruleMessages(ruleName, {
  expected: () =>
    `Selectors starting with an ampersand ` + `are not allowed inside top-level mixin rules`,
});

/** Config options for the rule. */
interface RuleOptions {
  filePattern: string;
}

/**
 * Stylelint rule that doesn't allow for the top-level rules inside a
 * mixin to start with an ampersand. Does not apply to internal mixins.
 */
const plugin = createPlugin(ruleName, (isEnabled: boolean, _options?) => {
  return (root, result) => {
    if (!isEnabled) {
      return;
    }

    const options = _options as RuleOptions;
    const filePattern = new RegExp(options.filePattern);
    const fileName = basename(root.source!.input.file!);

    if (!filePattern.test(fileName)) {
      return;
    }

    root.walkAtRules(node => {
      // Skip non-mixin atrules and internal mixins.
      if (!node.nodes || node.name !== 'mixin' || node.params.indexOf('_') === 0) {
        return;
      }

      node.nodes.forEach(childNode => {
        if (childNode.type === 'rule' && childNode.selector.indexOf('&') === 0) {
          utils.report({result, ruleName, message: messages.expected(), node: childNode});
        }
      });
    });
  };
});

plugin.ruleName = ruleName;
plugin.messages = messages;
export default plugin;
