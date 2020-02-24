import {Component, ViewEncapsulation} from '@angular/core';


@Component({selector: 'home', template: `<p>e2e website!</p>`})
export class Home {
}

@Component({
  selector: 'e2e-app-layout',
  templateUrl: 'e2e-app-layout.html',
  encapsulation: ViewEncapsulation.None,
})
export class E2eAppLayout {
  showLinks: boolean = false;
}
