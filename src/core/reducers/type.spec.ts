import {type} from './type';

describe('type', () => {
  it('should raise an exception if a label is registered twice', () => {
    type('label');
    expect(() => type('label')).toThrowError();
  });
});
