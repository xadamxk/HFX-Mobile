import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable()
export class GetProfileProvider {

  constructor() {
    //console.log('Hello GetProfileProvider Provider');
  }

  loadProfile(){
    var jsonObj = JSON.parse('{"success":true,"message":"","result":{"username":"xadamxk","postnum":18060,"avatar":"https:\/\/i.imgur.com\/Vwnh1Vr.jpg?dateline=1478259205?dateline=1486622325?dateline=1486622386","avatartype":"remote","usergroup":28,"displaygroup":42,"additionalgroups":[55,42,61,63,23,48],"usertitle":"HFX Mobile","timeonline":27395251,"regdate":"2011-04-23T01:47:10Z","lastactive":"2017-10-02T00:06:11Z","reputation":2858}}');
    
    if (jsonObj.success){
      return jsonObj.result;
    } else{
      console.log("get-profile failed to get data.");
    }
  }

}
