import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';
import { ProfilePage } from '../profile/profile';
import { ThreadPage } from '../thread/thread';
import { Storage } from '@ionic/storage';
// https://stackoverflow.com/questions/42305422/using-jquery-with-ionic-2
// Infinite scroll: https://www.djamware.com/post/59b0ac0c80aca768e4d2b139/an-example-of-ionic-3-infinite-scroll-or-load-more

/*
  DEV NOTES:
  - TODO: Add thread time in forum list
  - TODO: Add Last Post info in forum list

*/

@IonicPage()
@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html',
  providers: [ApIv1Provider]
})
export class ForumPage {
  // Standard Variables
  private pageTitle;
  public forum: any;
  public stickyThreads = [];
  public normalThreads = [];
  public threadCount: any;
  // Infinite Paging Variables
  public page: number;
  public loadedthreads: number;
  public fid: any;
  public totalthreads: number;
  // Favorites
  public favorited: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiv1: ApIv1Provider,
    private storage: Storage) {
    this.page = 1;
    this.fid = this.navParams.get('fid');
    this.searchFavorites();
    apiv1.getForum(this.navParams.get('fid')).then(
      (res) => {
        //console.log(res);
        this.forum = res;
        console.log(this.forum);
        this.loadedthreads = res.threaddata.length;
        this.totalthreads = parseInt(res.numthreads);
        this.threadCount = res.threaddata.length;

        for (var i = 0; i < this.forum.threaddata.length; i++) {
          // Sticky/ Normal Thread Arrays
          (this.forum.threaddata[i].sticky ?
            this.stickyThreads.push(this.forum.threaddata[i]) :
            this.normalThreads.push(this.forum.threaddata[i]));
          // Thread Prefix changes
          if (this.forum.threaddata[i].threadprefix) {
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
    this.page = this.page + 1;
    setTimeout(() => {
      this.apiv1.getForumPage(fid, this.page)
        .then(
        (res) => {
          //console.log(res);
          this.forum = res;
          console.log(this.forum);
          this.loadedthreads = this.loadedthreads + res.threaddata.length;
          for (var i = 0; i < this.forum.threaddata.length; i++) {
            // Sticky/ Normal Thread Arrays
            (this.forum.threaddata[i].sticky ?
              this.stickyThreads.push(this.forum.threaddata[i]) :
              this.normalThreads.push(this.forum.threaddata[i]));
            // Thread Prefix changes
            if (this.forum.threaddata[i].threadprefix) {
              var tempPrefix = this.forum.threaddata[i].threadprefix;
              tempPrefix = this.trimHTML(tempPrefix);
              tempPrefix = this.trimFirstLastChar(tempPrefix);
              this.forum.threaddata[i].threadprefix = tempPrefix;
            }
          }
        },
        (reject) => {
          console.error(reject);
          this.apiv1.displayErrorMessage(reject);
        }
        );

      console.log('Page ' + this.page + ' loaded.');
      infiniteScroll.complete();
    }, 500);
  }

  toggleFavorite(fid, pageTitle) {
    var favorites = JSON.parse(localStorage.getItem("favoriteForums"));

    // Remove from favorites
    if (this.favorited) {
      // Loop through favorites backwards
      for (var i = favorites.length - 1; i >= 0; i--) {
        if (favorites[i][0] == this.fid) {
          favorites.splice(i, 1);
        }
      }
      // Save changes
      localStorage.setItem("favoriteForums", JSON.stringify(favorites));
      this.favorited = false;
    }
    // Add to favorites
    else {
      if (favorites == null || favorites == '') {
        favorites = [];
      }
      let tempFav = [this.fid, this.pageTitle];
      favorites.push(tempFav);
      localStorage.setItem("favoriteForums", JSON.stringify(favorites));
      this.favorited = true;
    }

  }

  searchFavorites() {
    //localStorage.setItem("favoriteForums", JSON.stringify(''));
    var favorites = JSON.parse(localStorage.getItem("favoriteForums"));
    // If favorites exist
    if (favorites) {
      // Loop saved favorites
      for (var i = 0; i < favorites.length; i++) {
        // If favorited
        if (favorites[i][0] == this.fid) {
          this.favorited = true;
        }
      }
    }
  }

  launchProfilePage(forum) {
    this.navCtrl.push(ProfilePage, forum);
  }

  launchThreadPage(thread) {
    this.navCtrl.push(ThreadPage, thread);
  }

  ionViewDidLoad() {
    this.pageTitle = this.navParams.get('name');
    //console.log('ionViewDidLoad ForumPage');
  }

  trimHTML(string) {
    return string.replace(/<\/?[^>]+(>|$)/g, "");
  }

  trimFirstLastChar(string) {
    return string.substring(1, string.length - 1);
  }

}
