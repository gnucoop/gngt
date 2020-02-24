import {Component, NgModule} from '@angular/core';

@Component({
  selector: 'kitchen-sink',
  templateUrl: './kitchen-sink.html',
})
export class KitchenSink { }

@NgModule({
  declarations: [KitchenSink],
  exports: [KitchenSink],
})
export class KitchenSinkModule { }
