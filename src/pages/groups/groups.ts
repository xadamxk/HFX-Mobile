import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';

@IonicPage()
@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
  providers: [ApIv1Provider]
})
export class GroupsPage {
  public groups: any;
  public privateGroups = [];
  public siteGroups = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public apiv1: ApIv1Provider) {
    apiv1.getGroups().then(
      (res) => {
        console.log(res);
        this.groups = res.groups;

        for (var i=0; i < this.groups.length; i++) { 
          // Private/ Normal Group Arrays
          switch(this.groups[i].result.type){
            case 4: this.privateGroups.push(this.groups[i]);
            break;
            case 2: if(this.groups[i].result.name !== "Closed" && this.groups[i].result.name !== "Bots"){
              this.siteGroups.push(this.groups[i]);
            }
            break;
          }
        }
    
        // Clean up private group userbar URL
        for (var k=0; k < this.privateGroups.length; k++) { 
          if (this.privateGroups[k].result.userbar){
            this.privateGroups[k].result.userbar = 
            this.privateGroups[k].result.userbar.replace("{theme}", "modern_bl");
            this.privateGroups[k].result.userbar = 
            this.privateGroups[k].result.userbar.replace("{lang}", "english");
          }
        }
    
        // Clean up site group userbar URL
        for (var j=0; j < this.siteGroups.length; j++) { 
          if (this.siteGroups[j].result.userbar){
            this.siteGroups[j].result.userbar = 
            this.siteGroups[j].result.userbar.replace("{theme}", "modern_bl");
            this.siteGroups[j].result.userbar = 
            this.siteGroups[j].result.userbar.replace("{lang}", "english");
          }
        }
      },
      (reject) => {
        console.error(reject);
        apiv1.displayErrorMessage(reject);
      }
    );
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad GroupsPage');
  }

  pathForUserbarImages(name){
    if (name.includes("images/g")){
      return "https://hackforums.net/" + name;
    }
    return "https://hackforums.net/images/" + name;
  }

}
