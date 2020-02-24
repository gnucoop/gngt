import {BuildPackage} from '../package-tools';

export const corePackage = new BuildPackage('core');
export const ionicPackage = new BuildPackage('ionic', [corePackage]);
export const materialPackage = new BuildPackage('material', [corePackage]);
