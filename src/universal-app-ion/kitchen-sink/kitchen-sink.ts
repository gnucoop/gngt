import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServerModule} from '@angular/platform-server';

// import {AdminModule} from '@gngt/material/admin';
import {AuthModule} from '@gngt/ionic/auth';


@Component({
  selector: 'kitchen-sink',
  templateUrl: './kitchen-sink.html',
})
export class KitchenSink { }


@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'kitchen-sink'}),
    // AdminModule,
    AuthModule
  ],
  bootstrap: [KitchenSink],
  declarations: [KitchenSink],
  entryComponents: [],
})
export class KitchenSinkClientModule { }


@NgModule({
  imports: [KitchenSinkClientModule, ServerModule],
  bootstrap: [KitchenSink],
})
export class KitchenSinkServerModule { }
