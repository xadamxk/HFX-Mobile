import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ForumPage } from '../../pages/forum/forum';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {
  public favoriteForums;
  public favoritesEmpty: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage) {
    // Get Favorites
    this.getSortFavoriteForums();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad FavoritesPage');
  }

  getSortFavoriteForums() {
    this.favoriteForums = JSON.parse(localStorage.getItem("favoriteForums"));
    this.favoriteForums = this.favoriteForums.sort(function (a, b) {
      return a[1].localeCompare(b[1]);
    });
    // Empty Placeholder
    if (this.favoriteForums.length < 1) {
      this.favoritesEmpty = true;
    } else{
      this.favoritesEmpty = false;
    }
  }

  launchForumPage(forum) {
    if (!forum.fid) {
      forum['fid'] = forum[0];
    }
    if (!forum.name) {
      forum['name'] = forum[1];
    }
    this.navCtrl.push(ForumPage, forum);
  }

  removeItem(favoriteForums, forum) {
    for (let i = 0; i < favoriteForums.length; i++) {
      if (favoriteForums[i][0] == forum[0]) {
        favoriteForums.splice(i, 1);
      }
    }
    // Save changes
    localStorage.setItem("favoriteForums", JSON.stringify(favoriteForums));
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getSortFavoriteForums();
      refresher.complete();
    }, 1000);
  }
}
