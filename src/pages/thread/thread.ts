import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';
import { ProfilePage } from '../profile/profile';
import { DomSanitizer } from '@angular/platform-browser';
import { ActionSheetController } from 'ionic-angular';


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

  public posts: any;
  public uids = [];
  public users: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiv1: ApIv1Provider,
    private sanitizer: DomSanitizer,
    public actionSheet: ActionSheetController
  ) {
      //console.log(this.navParams);
      apiv1.getThread(this.navParams.get('tid')).then(
        (res) => {
          this.threadtitle = res.subject;
          this.threadprefix = this.trimHTML(res.threadprefix);
          this.threadprefix = this.trimFirstLastChar(this.threadprefix);
          this.threadclosed = res.closed;
          this.posts = res.postdata;
          // UID array
          for(var i in res.postdata){
            this.uids.push([res.postdata[i].uid]);
          }
          // Inject UIDS properties into posts object
          this.getUIDSResponse(apiv1, res.postdata, this.uids);
          
        },
        (reject) => {
          console.error(reject);
          apiv1.displayErrorMessage(reject);
        }
      );
  }

  injectUIDSProperties(posts, users){
    //console.log("Users Info:");
    //console.log(users);
    // Loop through users
    for (var postIndex = 0; postIndex < posts.length; postIndex++) { 
      //var count = 0;
      //for (var key in posts) {
      for (var userIndex = 0; userIndex < users.length; userIndex++) { 
        // Check matching UID
        //console.log(this.uids[userIndex] + ":" + posts[postIndex].uid);
        if (posts[postIndex].uid == this.users[userIndex].uid){
          //console.log(this.uids[userIndex] + ":" + posts[postIndex].uid);
          // avatar
          if (!posts.hasOwnProperty('avatar')) {
            posts[postIndex]['avatar'] = users[userIndex].result.avatar;
          }
          // avatartype
          if (!posts.hasOwnProperty('avatartype')) {
            posts[postIndex]['avatartype'] = users[userIndex].result.avatartype;
          }
          // displaygroup
          if (!posts.hasOwnProperty('displaygroup')) {
            posts[postIndex]['displaygroup'] = users[userIndex].result.displaygroup;
          }
          // reputation
          if (!posts.hasOwnProperty('reputation')) {
            posts[postIndex]['reputation'] = users[userIndex].result.reputation;
          }
          // username
          if (!posts.hasOwnProperty('username')) {
            posts[postIndex]['username'] = users[userIndex].result.username;
          }
          // usertitle
          if (!posts.hasOwnProperty('usertitle')) {
            posts[postIndex]['usertitle'] = this.trimMultipleSpaces(users[userIndex].result.usertitle);
          }
        }
      } // User Loop
    } // Post Loop
    
    return posts;
  }

  getUIDSResponse(apiv1: ApIv1Provider, postdata, uids){
    //console.log(this.navParams);
    apiv1.getUsers(uids).then(
      (res) => {
        //console.log(res);
        this.users = res;
        // Users data - add to posts
        this.posts = this.injectUIDSProperties(postdata, this.users);
      },
      (reject) => {
        console.error(reject);
        apiv1.displayErrorMessage(reject);
      }
    );
  }

  ionViewDidLoad() {
    this.pageTitle = this.navParams.get('subject');
    //console.log('ionViewDidLoad ThreadPage');
  }

  launchProfilePage(thread){
    //console.log(thread);
    if (!thread.user){
      thread['user'] = thread.uid;
    }
    this.navCtrl.push(ProfilePage, thread);
  }

  assembleHTMLItem(htmlString){
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  trimHTML(string){
    return string.replace(/<\/?[^>]+(>|$)/g, "");
  }

  trimFirstLastChar(string){
    return string.substring(1, string.length - 1);
  }

  trimMultipleSpaces(string){
    return string.replace(/\s{2,}/g,' ');
  }

  pathForImages(profile){
    //console.log(profile);
    var avatar;
    if(profile.avatartype == "upload"){
      //console.log("Avatar upload.");
      avatar = "https://hackforums.net/uploads/avatars" + profile.avatar.replace('./uploads/avatars','');
    } else if(profile.avatartype == "gallery"){
      //console.log("Avatar gallery.");
      avatar = "https://hackforums.net/" + profile.avatar;
    } else {
      //console.log("Avatar external.");
      avatar = profile.avatar;
    }
    //console.log(avatar);
    return avatar;
  }

  presentActionSheet() {
    let actionSheet = this.actionSheet.create({
      title: 'Post Actions',
      buttons: [
        {
          text: 'Share Post',
          role: 'destructive',
          handler: () => {
            console.log('Share clicked');
          }
        },{
          text: 'Cite',
          handler: () => {
            console.log('Cite clicked');
          }
        },{
          text: 'Posts',
          handler: () => {
            console.log('Posts clicked');
          }
        },{
          text: 'Threads',
          handler: () => {
            console.log('Threads clicked');
          }
        },{
          text: 'Posts on Thread',
          handler: () => {
            console.log('PoT clicked');
          }
        },{
          text: 'Other',
          handler: () => {
            console.log('Other clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
