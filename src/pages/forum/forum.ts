import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';
import { ProfilePage } from '../profile/profile';
import { ThreadPage } from '../thread/thread';
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

  public page: number;
  public loadedthreads: number;
  public fid: any;
  public totalthreads: number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public apiv1: ApIv1Provider) {
    this.page = 1;
    this.fid = this.navParams.get('fid');
    apiv1.getForum(this.navParams.get('fid')).then(
      (res) => {
        //console.log(res);
        this.forum = res;
        console.log(this.forum);
        this.loadedthreads = res.threaddata.length;
        this.totalthreads = parseInt(res.numthreads);
        this.threadCount = res.threaddata.length;

        for (var i=0; i < this.forum.threaddata.length; i++) { 
          // Sticky/ Normal Thread Arrays
          (this.forum.threaddata[i].sticky ? 
            this.stickyThreads.push(this.forum.threaddata[i]) : 
            this.normalThreads.push(this.forum.threaddata[i]));
          // Thread Prefix changes
          if(this.forum.threaddata[i].threadprefix){
            var tempPrefix = this.forum.threaddata[i].threadprefix;
            tempPrefix = this.trimHTML(tempPrefix);
            tempPrefix = this.trimFirstLastChar(tempPrefix);
            this.forum.threaddata[i].threadprefix = tempPrefix;
          }
        }
      },
      (reject) => {
        console.error(reject);
      }
    );
  }

  doInfinite(infiniteScroll, fid, loadedThreads) {
    this.page = this.page+1;
    setTimeout(() => {
      this.apiv1.getForumPage(fid, this.page)
         .then(
          (res) => {
             //console.log(res);
              this.forum = res;
              console.log(this.forum);
              this.loadedthreads = this.loadedthreads + res.threaddata.length;
              for (var i=0; i < this.forum.threaddata.length; i++) { 
                // Sticky/ Normal Thread Arrays
                (this.forum.threaddata[i].sticky ? 
                  this.stickyThreads.push(this.forum.threaddata[i]) : 
                  this.normalThreads.push(this.forum.threaddata[i]));
                // Thread Prefix changes
                if(this.forum.threaddata[i].threadprefix){
                  var tempPrefix = this.forum.threaddata[i].threadprefix;
                  tempPrefix = this.trimHTML(tempPrefix);
                  tempPrefix = this.trimFirstLastChar(tempPrefix);
                  this.forum.threaddata[i].threadprefix = tempPrefix;
                }
              }
           },
           (reject) => {
            console.error(reject);
          }
        );
  
      console.log('Page ' + this.page + ' loaded.');
      infiniteScroll.complete();
    }, 1000);
  }

  launchProfilePage(forum){
    this.navCtrl.push(ProfilePage, forum);
  }

  launchThreadPage(thread){
    this.navCtrl.push(ThreadPage, thread);
  }

  ionViewDidLoad() {
    this.pageTitle = this.navParams.get('name');
    //console.log('ionViewDidLoad ForumPage');
  }

  trimHTML(string){
    return string.replace(/<\/?[^>]+(>|$)/g, "");
  }

  trimFirstLastChar(string){
    return string.substring(1, string.length - 1);
  }

}
