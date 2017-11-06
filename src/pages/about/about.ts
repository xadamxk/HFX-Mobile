import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageBoxPage } from '../../pages/message-box/message-box';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    //
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AboutPage');
  }

  launchMessageBoxPage(index){
    var boxPage = {};
    boxPage['index'] = index;
    this.navCtrl.push(MessageBoxPage, boxPage);
  }

}
