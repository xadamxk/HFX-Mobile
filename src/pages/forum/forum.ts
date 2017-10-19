import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';
import { ProfilePage } from '../profile/profile';
// https://stackoverflow.com/questions/42305422/using-jquery-with-ionic-2

@IonicPage()
@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html',
  providers: [ApIv1Provider]
})
export class ForumPage {
  private pageTitle;
  public forum: any;
  public stickyThreads = [];
  public normalThreads = [];
  public threadCount: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public apiv1: ApIv1Provider) {
    apiv1.getForum(this.navParams.get('fid')).then(
      (res) => {
        //console.log(res);
        this.forum = res;
        console.log(this.forum);
        this.threadCount = res.threaddata.length;
        for (var i=0; i < this.forum.threaddata.length; i++) { 
          // Sticky/ Normal Thread Arrays
          (this.forum.threaddata[i].sticky ? 
            this.stickyThreads.push(this.forum.threaddata[i]) : 
            this.normalThreads.push(this.forum.threaddata[i]))
        }
      },
      (reject) => {
        console.error(reject);
      }
    );
  }

  launchProfilePage(forum){
    this.navCtrl.push(ProfilePage, forum);
  }

  ionViewDidLoad() {
    this.pageTitle = this.navParams.get('name');
    //console.log('ionViewDidLoad ForumPage');
  }

}
