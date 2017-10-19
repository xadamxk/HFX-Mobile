import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';
import { ThreadlistPage } from '../threadlist/threadlist';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [ApIv1Provider]
})
export class ProfilePage {
  public profile: any;
  public uid: any;
  public avatar: any;
  public avatarType: any;
  public username: any;
  public usertitle: any;
  public reputation: any;
  public repColor: any;
  public postnum: any;
  public lastactive: any;
  public timeonline: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public apiv1: ApIv1Provider) {
      //console.log(this.navParams);
      apiv1.getUser(this.navParams.get('user')).then(
        (res) => {
          //console.log(res);
          this.profile = res;
          this.uid = this.navParams.get('user');
          this.avatar = res.avatar;
          this.avatarType = res.avatartype;
          this.username = res.username;
          this.usertitle = res.usertitle;
          this.reputation = res.reputation;
          this.repColor = this.determineRepColor();
          this.postnum = res.postnum;
          this.lastactive = this.formatLastOnlineTime(res.lastactive);
          this.timeonline = this.calculateOnlineTime(res.timeonline);
        },
        (reject) => {
          console.error(reject);
        }
      );
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ProfilePage');
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

  determineRepColor(){
    var tempColor;
    if(this.reputation > 0){
      tempColor = "#32CD32";
    } else if(this.reputation == 0){
      tempColor = "#666666";
    } else if(this.reputation < 0){
      tempColor = "#CC3333";
    }
    return tempColor;
  }

  formatLastOnlineTime(input){
    // https://stackoverflow.com/a/23132249
    const wMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var example = new Date(input);
    var monthString = wMonths[example.getMonth()];
    var day = example.getDate();
    var year = example.getFullYear();
    var localTime = example.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    var finalString = monthString + " " + day + ", " + year + "\n" + localTime;
    
    return finalString;
  }

  calculateOnlineTime(delta){
    var daysInMonth = 30;
    var secsInDay = 86400;
    var secondsInHour = 3600;
    var hoursInDay = 24;
    var finalString = "";
    
    // calculate (and subtract) whole days
    var days = Math.floor(delta / secsInDay);
    var months = Math.floor(days / daysInMonth);
    delta -= days * secsInDay;
    days = days % daysInMonth;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / secondsInHour) % hoursInDay;
    delta -= hours * secondsInHour;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = delta % 60;

    if(months > 0){
      finalString += months + this.returnSIfPlural("Month", months);
    }
    if(days > 0){
      finalString += days + this.returnSIfPlural("Day", days);
    }
    if(hours > 0){
      finalString += hours + this.returnSIfPlural("Hour", hours);
    }
    if(minutes > 0){
      finalString += minutes + this.returnSIfPlural("Minute", minutes);
    }
    //console.log(finalString);
    return finalString;
  }

  returnSIfPlural(string, number){
    var spaceChar = " ";
    var tempString = "";
    // S or no S bc proper
    if(number > 1){
      tempString = string + "s,";
    } else{
      tempString = string + ",";
    }
    // Remove comma from last element
    if(string == "Minute"){
      tempString = tempString.replace(',','');
    } else{
      tempString += "\n";
    }
    return spaceChar + tempString;
  }

  launchThreadlistPage(profile){
    if(!profile.uid){
      profile['uid'] = this.uid;
    }
    this.navCtrl.push(ThreadlistPage, profile);
  }
}