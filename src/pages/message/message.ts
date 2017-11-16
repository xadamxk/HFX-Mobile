import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
  providers: [ApIv1Provider]
})
export class MessagePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiv1: ApIv1Provider
  ) {
    console.log(this.navParams);
    apiv1.getMessage(this.navParams.get('pmid')).then(
      (res) => {
        console.log(res);

      },
      (reject) => {
        console.error(reject);
        apiv1.displayErrorMessage(reject);
      }
    );
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MessagePage');
  }

}
