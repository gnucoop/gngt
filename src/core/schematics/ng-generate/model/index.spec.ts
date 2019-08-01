import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {createTestApp, getFileContent} from '../../testing';
import {Schema} from './schema';

describe('gngt-model-schematic', () => {
  let runner: SchematicTestRunner;

  const baseOptions: Schema = {
    path: 'src/app',
    project: 'gngt',
    package: 'foo',
    model: 'bar',
  };

  const newModelOptions: Schema = {
    path: 'src/app',
    project: 'gngt',
    package: 'foo',
    model: 'baz',
  };

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', require.resolve('../../collection.json'));
  });

  it('should create package and model files', async () => {
    const app = await createTestApp(runner);
    const tree = await runner.runSchematicAsync('model', baseOptions, app).toPromise();
    const files = tree.files;

    expect(files).toContain('/projects/gngt/src/app/foo/bar.actions.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/bar.effects.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/bar.manager.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/bar.reducers.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/bar.service.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/bar.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/foo.module.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/index.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/reducers.ts');
  });

  it('should create model files when package already exists', async () => {
    const app = await createTestApp(runner);
    await runner.runSchematicAsync('model', baseOptions, app).toPromise();
    const tree = await runner.runSchematicAsync('model', newModelOptions, app).toPromise();
    const files = tree.files;

    expect(files).toContain('/projects/gngt/src/app/foo/baz.actions.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/baz.effects.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/baz.manager.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/baz.reducers.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/baz.service.ts');
    expect(files).toContain('/projects/gngt/src/app/foo/baz.ts');

    const indexCont = getFileContent(tree, '/projects/gngt/src/app/foo/index.ts');
    expect(indexCont).toMatch(/export.*from '.\/baz'/);
    expect(indexCont).toMatch(/export.*from '.\/baz\.service'/);

    const reducersCont = getFileContent(tree, '/projects/gngt/src/app/foo/reducers.ts');
    expect(reducersCont).toMatch(/baz:.*fromBaz\.State/);
    expect(reducersCont).toMatch(/baz:.*fromBaz\.bazReducer/);

    const moduleCont = getFileContent(tree, '/projects/gngt/src/app/foo/foo.module.ts');
    expect(moduleCont).toMatch(/import.*BazManager.*from '.\/baz.manager'/);
    expect(moduleCont).toMatch(/import.*BazService.*from '.\/baz.service'/);
    expect(moduleCont).toMatch(/import.*BazEffects.*from '.\/baz.effects'/);
    expect(moduleCont).toMatch(/BazManager,/);
    expect(moduleCont).toMatch(/BazService,/);
    expect(moduleCont).toMatch(/BazEffects,/);
  });
});
