import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';
import { ProfilePage } from '../profile/profile';

// Pagination: http://michaelbromley.github.io/ngx-pagination/#/

@IonicPage()
@Component({
  selector: 'page-thread',
  templateUrl: 'thread.html',
  providers: [ApIv1Provider]
})
export class ThreadPage {
  private pageTitle;
  public thread: any;

  public threadtitle: any;
  public threadprefix: any;
  public threadclosed: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiv1: ApIv1Provider) {
      //console.log(this.navParams);
      
      apiv1.getThread(this.navParams.get('tid')).then(
        (res) => {
          console.log(res);
          this.threadtitle = res.subject;
          this.threadprefix = this.trimHTML(res.threadprefix);
          this.threadprefix = this.trimFirstLastChar(this.threadprefix);
          this.threadclosed = res.closed;
        },
        (reject) => {
          console.error(reject);
        }
      );
  }

  ionViewDidLoad() {
    this.pageTitle = this.navParams.get('subject');
    //console.log('ionViewDidLoad ThreadPage');
  }

  launchProfilePage(thread){
    this.navCtrl.push(ProfilePage, thread);
  }

  trimHTML(string){
    return string.replace(/<\/?[^>]+(>|$)/g, "");
  }

  trimFirstLastChar(string){
    return string.substring(1, string.length - 1);
  }

}
