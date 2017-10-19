import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [ApIv1Provider]
})
export class ContactPage {
public profile: any;
public avatar: any;
public username: any;
public usertitle: any;

  constructor(
    public navCtrl: NavController, 
    public apiv1: ApIv1Provider) {
      apiv1.getUserSelf().then(
        (res) => {
          //console.log(res);
          this.profile = res;
          this.avatar = res.avatar;
          this.username = res.username;
          this.usertitle = res.usertitle;
        },
        (reject) => {
          console.error(reject);
        }
      );
  }

  launchSettingsPage(){
    this.navCtrl.push(SettingsPage);
  }

}
