import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ForumPage } from '../forum/forum';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';

@IonicPage()
@Component({
  selector: 'page-forums',
  templateUrl: 'forums.html',
  providers: [ApIv1Provider]
})
export class ForumsPage {
  private pageTitle;
  public forums: any;
  public children: any;
  public type: any;
  public childrenCount: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public apiv1: ApIv1Provider) {
    apiv1.getCategory(this.navParams.get('fid')).then(
      (res) => {
        //console.log(res);
        this.forums = res;
        this.children = res.children;
        this.type = res.type;
        this.childrenCount = res.children.length;
      },
      (reject) => {
        console.error(reject);
      }
    );
  }

  launchForumPage(forum){
    if(!forum.fid){
      forum['fid'] = this.navParams.get('fid');
    }
    this.navCtrl.push(ForumPage, forum);
  }

  ionViewDidLoad() {
    this.pageTitle = this.navParams.get('name');
    //console.log(this.navParams);
  }

  pathForImages(name){
    return "https://hackforums.net/uploads/ficons/" + name;
  }

}
