import {NgModule} from '@angular/core';

import {AdminModule} from '@gngt/material/admin';
import {AuthModule} from '@gngt/material/auth';

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
