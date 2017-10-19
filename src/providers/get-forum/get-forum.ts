import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable()
export class GetForumProvider {

  constructor() {
    //console.log('Hello GetForumProvider Provider');
  }

  loadForum(fid){
    var jsonStr = '{"success":true,"message":"","result":{"name":"Rules,  Announcements, News, and Feedback","description":"This is where site rules and important announcements about the site are made. Please read carefully before you join. Also you can leave us feedback or ask site questions here.","type":"f","parent":1,"numthreads":"49502","threaddata":[{"tid":5705971,"sticky":true,"subject":"Requirements System Explained","threadprefix":"","user":3077324,"username":"Maxim","closed":false,"numreplies":77,"dateline":"2017-08-30T05:13:38Z","lastpost":"2017-09-16T16:30:04Z","lastposter":"Maxim","lastposteruid":3077324},{"tid":1829966,"sticky":true,"subject":"Warning System Explained -  Latest Update: 2\/9\/2017","threadprefix":"","user":646916,"username":"Genuine","closed":false,"numreplies":390,"dateline":"2011-10-17T05:24:08Z","lastpost":"2017-08-27T16:43:24Z","lastposter":"Mr.Zzz","lastposteruid":3680828},{"tid":2954624,"sticky":true,"subject":"Custom Pages and MyCodes Index","threadprefix":"","user":183072,"username":"Mr Kewl","closed":false,"numreplies":210,"dateline":"2012-10-23T11:59:44Z","lastpost":"2017-05-04T00:52:09Z","lastposter":"Ms. Bunny","lastposteruid":3552499},{"tid":5729382,"sticky":false,"subject":"My Account On 3 Mo Ban. Invalid?","threadprefix":"<span class=\"prefix\">[Account Help]<\/span>","user":3724917,"username":"GorillaHelpMe","closed":false,"numreplies":18,"dateline":"2017-10-02T16:44:30Z","lastpost":"2017-10-02T17:38:20Z","lastposter":"GorillaHelpMe","lastposteruid":3724917},{"tid":5729290,"sticky":false,"subject":"Bad reputation, so i cant sell my AGC","threadprefix":"","user":3240566,"username":"memehack","closed":true,"numreplies":7,"dateline":"2017-10-02T14:33:59Z","lastpost":"2017-10-02T15:29:39Z","lastposter":"memehack","lastposteruid":3240566},{"tid":5729287,"sticky":false,"subject":"Quick question","threadprefix":"","user":1126166,"username":"\u00d0oge","closed":true,"numreplies":4,"dateline":"2017-10-02T14:26:57Z","lastpost":"2017-10-02T14:29:54Z","lastposter":"Ctrl+Alt+Del","lastposteruid":3427514},{"tid":5729236,"sticky":false,"subject":"Does this count as flaming?","threadprefix":"","user":3124593,"username":"Caffiene","closed":true,"numreplies":2,"dateline":"2017-10-02T12:42:43Z","lastpost":"2017-10-02T12:45:09Z","lastposter":"Eagle 95","lastposteruid":129349},{"tid":5729186,"sticky":false,"subject":"Randomly Neg Repped . UDID 3192905","threadprefix":"","user":2181275,"username":"\u0432l\u03c5\u0493\u0493","closed":true,"numreplies":15,"dateline":"2017-10-02T11:07:16Z","lastpost":"2017-10-02T11:14:56Z","lastposter":"Steve","lastposteruid":2758907},{"tid":5729040,"sticky":false,"subject":"should i disclose a hf exploit responsbily?","threadprefix":"","user":3694520,"username":"Azim","closed":true,"numreplies":23,"dateline":"2017-10-02T04:22:04Z","lastpost":"2017-10-02T10:51:28Z","lastposter":"Omniscient","lastposteruid":1},{"tid":5723635,"sticky":false,"subject":"Thread Subscriptions Deleted","threadprefix":"","user":1,"username":"Omniscient","closed":false,"numreplies":115,"dateline":"2017-09-23T21:16:37Z","lastpost":"2017-10-02T07:42:45Z","lastposter":"Danny Khalifa","lastposteruid":2952200},{"tid":5727313,"sticky":false,"subject":"Rep Abuse?","threadprefix":"","user":3320508,"username":"Caleb\u2122","closed":true,"numreplies":13,"dateline":"2017-09-29T13:20:08Z","lastpost":"2017-10-01T18:45:08Z","lastposter":"Maxim","lastposteruid":3077324},{"tid":5349368,"sticky":false,"subject":"Prestige Explained - How To Gain Prestige - Formula","threadprefix":"","user":2758907,"username":"Steve","closed":false,"numreplies":304,"dateline":"2016-07-24T05:11:00Z","lastpost":"2017-10-01T13:10:17Z","lastposter":"theBallistic","lastposteruid":3713674},{"tid":5727814,"sticky":false,"subject":"How can i rep?","threadprefix":"","user":3685072,"username":"Banana cum swap","closed":true,"numreplies":11,"dateline":"2017-09-30T08:56:21Z","lastpost":"2017-09-30T23:54:45Z","lastposter":"arbyhteam","lastposteruid":3166299},{"tid":5718189,"sticky":false,"subject":"HF IM XMPP Offline","threadprefix":"","user":1,"username":"Omniscient","closed":false,"numreplies":68,"dateline":"2017-09-15T13:14:02Z","lastpost":"2017-09-30T20:28:32Z","lastposter":"Maxim","lastposteruid":3077324},{"tid":5721317,"sticky":false,"subject":"5K posts short feedback thread","threadprefix":"","user":1729678,"username":"ScreemS","closed":false,"numreplies":21,"dateline":"2017-09-20T06:35:04Z","lastpost":"2017-09-30T11:02:58Z","lastposter":"Mustys","lastposteruid":3506627},{"tid":5727741,"sticky":false,"subject":"Edit User Title?","threadprefix":"<span class=\"prefix\">[Account Help]<\/span>","user":3722969,"username":"Ken Thompson","closed":true,"numreplies":2,"dateline":"2017-09-30T06:04:02Z","lastpost":"2017-09-30T06:08:19Z","lastposter":"Ken Thompson","lastposteruid":3722969},{"tid":5725498,"sticky":false,"subject":"Hacker.IM","threadprefix":"","user":1,"username":"Omniscient","closed":false,"numreplies":92,"dateline":"2017-09-26T18:01:44Z","lastpost":"2017-09-29T18:37:34Z","lastposter":"Crystallize.","lastposteruid":3125649},{"tid":5727279,"sticky":false,"subject":"Is there a Go section?","threadprefix":"<span class=\"prefix\">[Feedback]<\/span>","user":3704948,"username":"Meave","closed":true,"numreplies":1,"dateline":"2017-09-29T12:07:35Z","lastpost":"2017-09-29T13:27:14Z","lastposter":"Maxim","lastposteruid":3077324},{"tid":5724981,"sticky":false,"subject":"Forgotten credentials...","threadprefix":"<span class=\"prefix\">[Account Help]<\/span>","user":2352002,"username":"Jeremiah \u2020","closed":true,"numreplies":7,"dateline":"2017-09-25T22:52:15Z","lastpost":"2017-09-29T01:58:40Z","lastposter":"Views","lastposteruid":2947999},{"tid":5726652,"sticky":false,"subject":"PSN Accounts","threadprefix":"<span class=\"prefix\">[Policy Q]<\/span>","user":2900879,"username":"Relynek","closed":true,"numreplies":1,"dateline":"2017-09-28T13:09:52Z","lastpost":"2017-09-28T13:16:38Z","lastposter":"Eagle 95","lastposteruid":129349}]}}';
    var jsonObj = JSON.parse(jsonStr.replace(/<\/?[^>]+>/gi, ''));
    if (jsonObj.success){
      return jsonObj.result;
    } else{
      console.log("get-forum failed to get data.");
    }
  }

}
