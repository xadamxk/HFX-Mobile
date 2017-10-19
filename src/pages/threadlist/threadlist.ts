import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';

@IonicPage()
@Component({
  selector: 'page-threadlist',
  templateUrl: 'threadlist.html',
  providers: [ApIv1Provider]
})
export class ThreadlistPage {
  public threadlist: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiv1: ApIv1Provider) {
      //
      //console.log(this.navParams.get('uid'));
      apiv1.getUserThreads(this.navParams.get('uid')).then(
        (res) => {
          //console.log(res);
          this.threadlist = res.threads;
        },
        (reject) => {
          console.error(reject);
        }
      );
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ThreadlistPage');
  }

}
