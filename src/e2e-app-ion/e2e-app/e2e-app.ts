import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

import {NavController} from '@ionic/angular';

@Component({
  selector: 'home',
  template: `<p>e2e website!</p>`
})
export class Home {}

@Component({
  moduleId: module.id,
  selector: 'e2e-app',
  templateUrl: 'e2e-app.html',
  styles: [':root { --ion-color-primary: #1a54b7; }'],
  encapsulation: ViewEncapsulation.None,
})
export class E2EApp {
  showLinks: boolean = false;

  constructor(private _navCtrl: NavController, private _router: Router) { }

  navTo(route: string) {
    this._navCtrl.setDirection('forward');
    this._router.navigateByUrl(route);
  }
}
