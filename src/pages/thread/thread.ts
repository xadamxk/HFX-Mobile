import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';
import { ProfilePage } from '../profile/profile';
import { DomSanitizer } from '@angular/platform-browser';
import { ActionSheetController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
// Pagination
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';


// Pagination: http://michaelbromley.github.io/ngx-pagination/#/

@IonicPage()
@Component({
  selector: 'page-thread',
  templateUrl: 'thread.html',
  providers: [ApIv1Provider]
})
export class ThreadPage {
  //
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;
  public showLeftButton: boolean;
  public showRightButton: boolean;
  public selectedCategory: number;
  public categories: Array<number>;

  private pageTitle;
  public thread: any;
  public threadID: any;
  public threadAuthor: any;
  public threadAuthorUID: any;
  public dateline: any;

  public threadtitle: any;
  public threadprefix: any;
  public threadclosed: any;
  public numreplies: any;

  public posts: any;
  public uids = [];
  public users: any;
  public pageCount: number;
  public currentPage: number;
  public pages: any;

  public threadIDStr = "https://hackforums.net/showthread.php?tid=";
  public postIDStr = "&pid=";
  public profileStr = 'https://hackforums.net/member.php?action=profile&uid=';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiv1: ApIv1Provider,
    private sanitizer: DomSanitizer,
    public actionSheet: ActionSheetController,
    public toastCtrl: ToastController,
    private clipboard: Clipboard
  ) {
    this.threadID = this.navParams.get('tid');
      console.log(this.navParams);
      apiv1.getThread(this.threadID).then(
        (res) => {
          // Variables
          this.threadtitle = res.subject;
          this.pageTitle = this.threadtitle;
          this.threadprefix = this.trimHTML(res.threadprefix);
          this.threadprefix = this.trimFirstLastChar(this.threadprefix);
          this.threadclosed = res.closed;
          this.threadAuthor = res.username;
          this.threadAuthorUID = res.user;
          //this.dateline = this.formatDate(res.dateline);
          this.currentPage = 1;
          this.numreplies = res.numreplies;
          // Pages
          this.pageCount = this.createPageCount(this.numreplies); // page count (total/10)
          this.pages = Array(this.pageCount+1).fill(this.pageCount + 1).map((x,i)=>i); // array based on count
          this.pages.splice(0,1); // remove 0 index
          this.initializeCategories();
          // Post data
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

  doNextPage(tid, page){
    page = parseInt(page)+1;
    if(page <= this.pageCount){
      this.doInfinite(tid, page);
    }
  }

  doInfinite(tid, page) {
    // Save var
    this.currentPage = page;
    // Reset prev info
    this.uids = [];
    // API call
    this.apiv1.getThreadPage(tid, page).then(
      (res) => {
        this.threadtitle = res.subject;
        this.pageTitle = this.threadtitle;
        this.threadprefix = this.trimHTML(res.threadprefix);
        this.threadprefix = this.trimFirstLastChar(this.threadprefix);
        this.threadclosed = res.closed;
        this.threadAuthor = res.username;
        this.threadAuthorUID = res.user;
        this.numreplies = res.numreplies;
        this.posts = res.postdata;
        // UID array
        for(var i in res.postdata){
          this.uids.push([res.postdata[i].uid]);
        }
        // Inject UIDS properties into posts object
        this.getUIDSResponse(this.apiv1, res.postdata, this.uids);
        //
        this.content.scrollToTop();
        this.slides.slideTo(page-1);
      },
      (reject) => {
        console.error(reject);
        this.apiv1.displayErrorMessage(reject);
      }
    );

    console.log('Page ' + page + ' loaded.');
  }

  createPageCount(numreplies){
    var pageCount = 0;
    pageCount = Math.floor(parseInt(numreplies) / 10) + 1;
    //console.log("Num Pages: "+ pageCount);
    return pageCount;
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
    //this.pageTitle = this.navParams.get('subject');
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

  presentThreadActionSheet() {
    let actionSheet1 = this.actionSheet.create({
      title: 'Thread Actions',
      buttons: [
        {
          text: 'Link',
          handler: () => {
            //console.log('Link Thread clicked');
            var link = this.formTIDLink();
            console.log(link);
            this.clipboard.copy(link);
            this.presentToast('Link copied...');
          }
        },{
          text: 'Cite',
          handler: () => {
            //console.log('Cite Thread clicked');
            var citation = this.formThreadCitation();
            console.log(citation);
            this.clipboard.copy(citation);
            this.presentToast('Citation copied...');
          }
        },{
          text: 'Other',
          role: 'destructive',
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
    actionSheet1.present();
  }

  presentPostActionSheet(postInfo) {
    // postInfo contains:
    //  - message
    //  - pid
    //  - subject
    //  - uid
    //  - username
    console.log(postInfo);
    let actionSheet = this.actionSheet.create({
      title: 'Post Actions',
      buttons: [
        {
          text: 'Link',
          handler: () => {
            //console.log('Link Post clicked');
            var link = this.formPIDLink(postInfo);
            //console.log(link);
            this.clipboard.copy(link);
            this.presentToast('Link copied...');
          }
        },{
          text: 'Cite',
          handler: () => {
            //console.log('Cite clicked');
            var citation = this.formPostCitation(this.formPIDLink(postInfo), postInfo);
            //console.log(citation);
            this.clipboard.copy(citation);
            this.presentToast('Citation copied...');
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
          role: 'destructive',
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

  presentToast(alertString) {
    let toast = this.toastCtrl.create({
      message: alertString,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Dismiss',
      position: 'top'
    });
    toast.present();
  }

  formTIDLink(){
    return this.threadIDStr + this.threadID;
  }

  formPIDLink(postInfo){
    return this.threadIDStr + this.threadID + this.postIDStr + postInfo.pid;
  }

  formPostCitation(postLink, postInfo){
    // User's
    var str1 = '[url=';
    var postAuthorLink = this.formAuthorLink(postInfo.uid);
    var str2 = '][b]';
    var postAuthorUsername = postInfo.username;
    var str3 = "'s[/b][/url] ";
    // Post
    var str4 = '[url=';
    var str5 = '][b]Post[/b][/url]';

    return str1 + postAuthorLink + str2 + postAuthorUsername + str3 + str4 + postLink + str5;
  }

  formThreadCitation(){
    // Thread
    var str1 = '[url=';
    var threadLink = this.formTIDLink();
    var str2 = '][b]';
    var threadTitle = this.threadtitle;
    var str3 = "[/b][/url] ";
    // Author
    var str4 = 'by [url=';
    var postAuthorLink = this.formAuthorLink(this.threadAuthorUID);
    var str5 = '][b]';
    var postAuthorUsername = this.threadAuthor;
    var str6 = "[/b][/url] ";

    return str1 + threadLink + str2 + threadTitle + str3 + str4 + postAuthorLink + str5 + postAuthorUsername + str6;
  }

  formAuthorLink(uid){
    return this.profileStr + uid;
  }

  //
  private formatDate(input){
    var example = new Date(input);
    var date = example.toDateString();
    var timeOptions = {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit'
    }
    var time = example.toLocaleString('en-US', timeOptions);
    var finalFormat = date + ', ' + time;
    return  finalFormat;
  }

  // calculate post number
  public calcPostNum(post){ 
    var currentPageVal = (this.currentPage - 1) * 10;
    var currentPostVal = parseInt(post) + 1;
    return  currentPageVal + currentPostVal;
  }

  //
  determineRepColor(reputation){
    var tempColor;
    if(reputation > 0){
      tempColor = "#32CD32";
    } else if(reputation == 0){
      tempColor = "#666666";
    } else if(reputation < 0){
      tempColor = "#CC3333";
    }
    return tempColor;
  }

  private scrollToElement(elementId){
    let yOffset = document.getElementById(elementId).offsetTop;
    this.content.scrollTo(0, yOffset, 500)
    }


  // Below is pagination
  private initializeCategories(): void {
    this.categories = this.pages;
      // Select it by defaut
      this.selectedCategory = this.categories[0];

      // Check which arrows should be shown
      this.showLeftButton = false;
      //console.log("page count: " + this.categories.length);
      this.showRightButton = this.categories.length > 3;
  }

  // Method executed when the slides are changed
  public slideChanged(): void {
      let currentIndex = this.slides.getActiveIndex();
      this.showLeftButton = currentIndex !== 0;
      this.showRightButton = currentIndex !== this.pageCount;
  }

  // Method that shows the next slide
  public slideNext(): void {
      this.slides.slideNext();
      this.slides.slideNext();
      this.slides.slideNext();
  }

  // Method that shows the previous slide
  public slidePrev(): void {
      this.slides.slidePrev();
      this.slides.slidePrev();
      this.slides.slidePrev();
  }

  public rightPageHold(){
    this.slides.slideTo(this.pageCount);
  }

  public leftPageHold(){
    this.slides.slideTo(0);
  }

}
