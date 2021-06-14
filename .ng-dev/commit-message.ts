import {CommitMessageConfig} from '@angular/dev-infra-private/commit-message/config';

/**
 * The configuration for `ng-dev commit-message` commands.
 */
export const commitMessage: CommitMessageConfig = {
  maxLineLength: Infinity,
  minBodyLength: 0,
  minBodyLengthTypeExcludes: ['docs'],
  scopes: [
    'multiple', // For when a commit applies to multiple components.
    'core/admin',
    'core/auth',
    'core/calendar',
    'core/common',
    'core/model',
    'core/reducers',
    'core/sync',
    'core/translations',
    'ionic/admin',
    'ionic/auth',
    'ionic/calendar',
    'ionic/common',
    'material/admin',
    'material/auth',
    'material/calendar',
    'material/common',
  ],
};
