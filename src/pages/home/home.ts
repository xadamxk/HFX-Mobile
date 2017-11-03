import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CategoryPage } from '../category/category';
import { GroupsPage } from '../groups/groups';
import { ThreadPage } from '../thread/thread';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApIv1Provider]
})
export class HomePage {
  public categories: any;

  constructor(
    public navCtrl: NavController, 
    public apiv1: ApIv1Provider) {
    apiv1.getCategories().then(
      (res) => {
        console.log(res);
        this.categories = res.children;
      },
      (reject) => {
        console.error(reject);
        apiv1.displayErrorMessage(reject);
      }
    );
  }

  launchCategoryPage(category){
    this.navCtrl.push(CategoryPage, category);
  }

  launchGroupsPage(category){
    this.navCtrl.push(GroupsPage, category);
  }

  // For testing
  launchTestThreadPage(category){
    category['tid'] = 5741402;
    this.navCtrl.push(ThreadPage, category);
  }

}
