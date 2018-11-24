import {Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {getFileContent} from '@schematics/angular/utility/test';

import {createTestApp} from '@gngt/core/schematics/testing';

describe('ng-add schematic', () => {
  let runner: SchematicTestRunner;
  let appTree: Tree;

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', require.resolve('../collection.json'));
    appTree = createTestApp(runner);
  });

  it('should update package.json', () => {
    const tree = runner.runSchematic('ng-add', {}, appTree);
    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));
    const dependencies = packageJson.dependencies;

    expect(dependencies['@angular/material']).toBeDefined();
    expect(dependencies['@gngt/material']).toBeDefined();

    expect(Object.keys(dependencies)).toEqual(Object.keys(dependencies).sort(),
        'Expected the modified "dependencies" to be sorted alphabetically.');

    expect(runner.tasks.some(task => task.name === 'run-schematic')).toBe(true);
  });

  describe('auth enabled', () => {
    it('should add the AuthModule to the project module', () => {
      const tree = runner.runSchematic('ng-add-setup-project', {}, appTree);
      const fileContent = getFileContent(tree, '/projects/gngt/src/app/app.module.ts');

      expect(fileContent).toContain('AuthModule',
        'Expected the project app module to import the "AuthModule".');
    });
  });
});
