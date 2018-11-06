import {BuildPackage} from 'gngt-build-tools';

export const corePackage = new BuildPackage('core');
export const materialPackage = new BuildPackage('material', [corePackage]);
export const examplesPackage = new BuildPackage('material-examples', [materialPackage]);

/** List of all build packages defined for this project. */
export const allBuildPackages = [
  corePackage,
  materialPackage,
  examplesPackage
];
