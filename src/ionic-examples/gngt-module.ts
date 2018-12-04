import {NgModule} from '@angular/core';

import {AdminModule} from '@gngt/ionic/admin';
import {AuthModule} from '@gngt/ionic/auth';

@NgModule({
  imports: [
    AdminModule,
    AuthModule,
  ],
  exports: [
    AdminModule,
    AuthModule,
  ]
})
export class ExampleGngtModule {}
