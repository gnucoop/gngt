import {ModuleWithProviders, NgModule} from '@angular/core';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {<%= classify(model) %>Effects} from './<%= dasherize(model) %>.effects';
import {<%= classify(model) %>Manager} from './<%= dasherize(model) %>.manager';
import {<%= classify(model) %>Service} from './<%= dasherize(model) %>.service';
import {reducers} from './reducers';

const <%= underscore(package).toUpperCase() %>_EFFECTS = [
  <%= classify(model) %>Effects,
];

@NgModule({
  imports: [
    StoreModule.forFeature('<%= camelize(package) %>', reducers),
    EffectsModule.forFeature(<%= underscore(package).toUpperCase() %>_EFFECTS)
  ],
})
export class <%= classify(package) %>Module {
  static forRoot(): ModuleWithProviders<<%= classify(package) %>Module> {
    return {
      ngModule: <%= classify(package) %>Module,
      providers: [
        <%= classify(model) %>Effects,
        <%= classify(model) %>Manager,
        <%= classify(model) %>Service,
      ],
    };
  }
}
