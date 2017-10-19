import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { GetCategoryProvider } from '../../providers/get-category/get-category';
import { ForumsPage } from '../forums/forums';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
  providers: [ApIv1Provider]
})
export class CategoryPage {
  private pageTitle;
  public category: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public apiv1: ApIv1Provider) {
    //this.loadCategory();
    apiv1.getCategory(this.navParams.get('fid')).then(
      (res) => {
        //console.log(res);
        this.category = res.children;
      },
      (reject) => {
        console.error(reject);
      }
    );
  }

  loadCategory(){
    //this.category = this.categoryProvider.loadCategory(this.navParams.get('fid'));
    //console.log(this.forums);
  }

  launchForumsPage(forums){
    this.navCtrl.push(ForumsPage, forums);
  }

  ionViewDidLoad() {
    this.pageTitle = this.navParams.get('name');
    //console.log('ionViewDidLoad CategoryPage');
  }

  pathForImages(name){
    return "https://hackforums.net/uploads/ficons/" + name;
  }

}
