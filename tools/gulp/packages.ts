import {BuildPackage} from 'gngt-build-tools';

export const corePackage = new BuildPackage('core');
export const materialPackage = new BuildPackage('material', [corePackage]);
export const matExamplesPackage = new BuildPackage('material-examples', [materialPackage]);
export const ionicPackage = new BuildPackage('ionic', [corePackage]);
export const ionExamplesPackage = new BuildPackage('ionic-examples', [ionicPackage]);

/** List of all build packages defined for this project. */
export const allBuildPackages = [
  corePackage,
  materialPackage,
  matExamplesPackage,
  ionicPackage,
  ionExamplesPackage
];
