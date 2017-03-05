import { RegisterPage } from './../register/register';
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  registerPage;

  constructor(public navCtrl: NavController) {
    this.registerPage = RegisterPage;
  }

}
