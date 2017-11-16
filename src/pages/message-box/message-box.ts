import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';
import { MessagePage } from '../message/message';
import { ProfilePage } from '../profile/profile';

@IonicPage()
@Component({
  selector: 'page-message-box',
  templateUrl: 'message-box.html',
  providers: [ApIv1Provider]
})
export class MessageBoxPage {
  private currentBoxIndex: any;
  private pms: any;
  private pmsArray = [];
  private boxName: string;
  private loadedPages: number;
  private totalPages: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiv1: ApIv1Provider
  ) {
    this.currentBoxIndex = this.navParams.get('index');
    apiv1.getPMBox(this.navParams.get('index')).then(
      (res) => {
        console.log(res);
        this.pms = res.pms;
        for (var i=0; i < this.pms.length; i++) { 
          this.pmsArray.push(this.pms[i]);
        }
        this.boxName = this.capitalize(res.pmbox);
        this.loadedPages = 1;
        this.totalPages = Math.ceil(res.pageInfo.total/20);

      },
      (reject) => {
        console.error(reject);
        apiv1.displayErrorMessage(reject);
      }
    );
  }

  doInfinite(infiniteScroll) {
    this.loadedPages = this.loadedPages+1;
    setTimeout(() => {
      this.apiv1.getPMBoxPage(this.currentBoxIndex, this.loadedPages).then(
        (res) => {
          console.log(res);
          this.pms = res.pms;
          for (var i=0; i < this.pms.length; i++) { 
            this.pmsArray.push(this.pms[i]);
          }
          this.boxName = this.capitalize(res.pmbox);
          this.totalPages = res.pageInfo.total;
  
        },
        (reject) => {
          console.error(reject);
          this.apiv1.displayErrorMessage(reject);
        }
      );
  
      console.log('Page ' + this.loadedPages + ' loaded.');
      infiniteScroll.complete();
    }, 500);
  }

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

  launchMessagePage(message){
    this.navCtrl.push(MessagePage, message);
  }

  launchProfilePage(message){
    // add sender as user
    if(!message.user){
      message['user'] = message.sender;
    }
    this.navCtrl.push(ProfilePage, message);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MessageBoxPage');
  }

  capitalize(s){
      return s && s[0].toUpperCase() + s.slice(1);
  }
}
