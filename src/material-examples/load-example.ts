/**
 * @license
 * Copyright (C) 2018 Gnucoop soc. coop.
 *
 * This file is part of the Gnucoop Angular Toolkit (gngt).
 *
 * Gnucoop Angular Toolkit (gngt) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Gnucoop Angular Toolkit (gngt) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Gnucoop Angular Toolkit (gngt).  If not, see http://www.gnu.org/licenses/.
 *
 */

import {ComponentFactory, Injector, NgModuleFactory, Type} from '@angular/core';
import {EXAMPLE_COMPONENTS} from './example-module';

/** Asynchronously loads the specified example and returns its component factory. */
export async function loadExampleFactory(name: string, injector: Injector)
    : Promise<ComponentFactory<any>> {
  const {componentName, module} = EXAMPLE_COMPONENTS[name];
  // TODO(devversion): remove the NgFactory import when the `--config=view-engine` switch is gone.
  const [moduleFactoryExports, moduleExports] = await Promise.all([
    import(module.importSpecifier + '/index.ngfactory'),
    import(module.importSpecifier)
  ]);
  const moduleFactory: NgModuleFactory<any> = moduleFactoryExports[`${module.name}NgFactory`];
  const componentType: Type<any> = moduleExports[componentName];
  return moduleFactory.create(injector)
    .componentFactoryResolver.resolveComponentFactory(componentType);
}

