import {Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';

import {createTestApp, getFileContent} from '../testing';

describe('ng-add schematic', () => {
  let runner: SchematicTestRunner;
  let appTree: Tree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', require.resolve('../collection.json'));
    appTree = await createTestApp(runner);
  });

  it('should update package.json', async () => {
    const tree = await runner.runSchematicAsync('ng-add', {}, appTree).toPromise();
    const packageJson = JSON.parse(getFileContent(tree, '/package.json'));
    const dependencies = packageJson.dependencies;

    expect(dependencies['@angular/cdk']).toBeDefined();
    expect(dependencies['@gngt/core']).toBeDefined();
    expect(dependencies['@ngrx/effects']).toBeDefined();
    expect(dependencies['@ngrx/store']).toBeDefined();
    expect(dependencies['@ngx-translate/core']).toBeDefined();
    expect(dependencies['url-parse']).toBeDefined();

    expect(Object.keys(dependencies)).toEqual(Object.keys(dependencies).sort(),
        'Expected the modified "dependencies" to be sorted alphabetically.');

    expect(runner.tasks.some(task => task.name === 'run-schematic')).toBe(true);
  });

  describe('translations enabled', () => {
    it('should add the TranslationsModule to the project module', async () => {
      const tree = await runner.runSchematicAsync('ng-add-setup-project', {}, appTree).toPromise();
      const fileContent = getFileContent(tree, '/projects/gngt/src/app/app.module.ts');

      expect(fileContent).toContain('TranslationsModule',
        'Expected the project app module to import the "TranslationsModule".');
    });
  });
});
