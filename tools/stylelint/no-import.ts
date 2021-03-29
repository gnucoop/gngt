import {createPlugin, utils} from 'stylelint';
import {basename} from 'path';

const ruleName = 'gngt/no-import';
const messages = utils.ruleMessages(ruleName, {
  expected: () => '@import is not allowed. Use @use instead.',
});

/** Stylelint plugin that doesn't allow `@import` to be used. */
const plugin = createPlugin(ruleName, (isEnabled: boolean, options?: {exclude?: string}) => {
  return (root, result) => {
    if (!isEnabled) {
      return;
    }

    const excludePattern = options?.exclude ? new RegExp(options.exclude) : null;

    if (excludePattern?.test(basename(root.source!.input.file!))) {
      return;
    }

    root.walkAtRules(rule => {
      if (rule.name === 'import') {
        utils.report({
          result,
          ruleName,
          message: messages.expected(),
          node: rule
        });
       }
    });
  };
});

plugin.ruleName = ruleName;
plugin.messages = messages;
export default plugin;
