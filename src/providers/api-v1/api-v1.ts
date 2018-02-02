import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Retrieving GET headers: http://strangemilk.com/access-http-response-headers-angularjs/
// Autoformat: SHIFT+ALT+F

class User {
  username: string;
  postnum: number;
  avatar: string;
  avatartype: string;
  usergroup: number;
  displaygroup: number;
  additionalgroups: [number];
  usertitle: string;
  timeonline: number;
  regdate: string;
  lastactive: string;
  reputation: number;
}

class Users {
  uids: [{
    uid: number;
    success: boolean;
    result: [{
      User
    }]
  }]
}

class Inbox {
  pmbox: string;
  pageInfo: {
    total: number;
  }
  pms: [{
    pmid: number;
    subject: string;
    senderusername: string;
    sender: number;
    receiptusername: any;
    receipt: any;
    status: number;
    dateline: string;
  }]
}

class Message {
  dateline: string;
  folder: number;
  from: number;
  fromusername: string;
  message: string;
  subject: string;
  to: number;
  tousername: string;
}

class Category {
  name: string;
  description: string;
  type: string;
  parent: number;
  ficon: string;
  children: [{
    fid: number;
    name: string;
    description: string;
    type: string;
    ficon: string;
  }]
}

class Forum {
  name: string;
  description: string;
  type: string;
  parent: number;
  numthreads: string;
  threaddata: [{
    tid: number;
    sticky: boolean;
    subject: string;
    threadprefix: string;
    user: number;
    username: string;
    closed: boolean;
    numreplies: number;
    dateline: string;
    lastpost: string;
    lastposter: string;
    lastposteruid: number;
  }]
}

class Groups {
  pageInfo: {
    total: number;
  }
  groups: [{
    gid: string;
    success: boolean;
    message: string;
    result: [{
      name: string;
      type: number;
      description: string;
      userbar: string;
      owner: {
        uid: number;
        username: string;
      }
      leaders: [{
        uid: number;
        username: string;
      }]
    }]
  }]
}

class Threadlist {
  pageinfo: {
    total: string;
  }
  threads: [{
    tid: number;
    subject: string;
    threadprefix: string;
    user: number;
    username: string;
    fid: number;
    closed: boolean;
    numreplies: number;
    dateline: string;
    firstpost: number;
  }]
}

class Thread {
  subject: string;
  threadprefix: string;
  user: number;
  username: string;
  fid: number;
  closed: boolean;
  numreplies: number;
  dateline: string;
  firstpost: number;
  postdata: [{
    pid: number;
    parent: number;
    subject: string;
    uid: number;
    dateline: string;
    message: string;
    edituid: number;
    edittime: string;
  }]
}



@Injectable()
export class ApIv1Provider {

  private apiUrl: string = 'https://hackforums.net/api/v1';
  //private apiKey; //set default key or call set key method.

  public headers: Headers;
  public options: RequestOptions;

  private STORAGE_KEY = 'apiKey';
  private key: string = '';

  constructor(
    public http: Http,
    public alertCtrl: AlertController,
    public storage: Storage) {
      this.setHeaders = this.setHeaders.bind(this);
      this.getRequest = this.getRequest.bind(this);
      this.postRequest = this.postRequest.bind(this);
      //let key = 'jnvoQiYBVHycI2FecJyMIyYr7HYR4nL7';
      //this.setKey();
  }

  /**
   * Sets API Key
   * @param  {string} key API Key provided by https://hackforums.net/apikey.php
   * @return
   */
  setKey(keyProp) {
    return this.storage.get(keyProp);
}

  getKey(storageKey: string): Promise<string> {
    return this.storage.get(storageKey);
  }

  /**
   * Using setHeaders method to add all headers dynamically to requests.
   * @return {Promise}
   */
  setHeaders(apiKey): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let apiKeyEncoded = window.btoa(apiKey + ":");
      this.headers = new Headers({
      'Authorization': 'Basic ' + apiKeyEncoded
      });
      this.options = new RequestOptions({ headers: this.headers });
      resolve(true); //Finished setting variables
  });
  }

  getRequest(url: string): any {
    return this.setKey('apiKey')
        .then(this.setHeaders)
        .catch(err => console.log('handle errors for api key retrieval and setting headers here'))
        .then(() => {
            return this.http.get(this.apiUrl + url, this.options)
                .map(res => {
                var jsonObj = res.json();
                var limitKeyName = "x-rate-limit-remaining";
                // Append result if not exist
                if (!jsonObj.result) {
                    jsonObj['result'] = [];
                }
                // Append keylimit if not exist
                if (!jsonObj.result[limitKeyName]) {
                    jsonObj.result[limitKeyName] = res.headers.toJSON()[limitKeyName];
                }
                // For le debugz
                console.log('URL: ' + this.apiUrl + url + "\n" +
                    "Remaining Calls: " + jsonObj.result[limitKeyName]);
                return jsonObj;
                });
        });
  }

  postRequest(url: string, data: any): any {
    return this.setKey('apiKey')
        .then(this.setHeaders)
        .catch(err => console.log('handle errors for api key retrieval and setting headers here'))
        .then(() => {
            return this.http.post(this.apiUrl + url, data, this.options)
                .map(res => res.json());
        });
  }

  displayErrorMessage(error) {
    const alert = this.alertCtrl.create({
      title: 'An Error Occured',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  /**
   * Gets authentcatied users inbox and structures object based on Inbox class for reference.
   * @return {Promise<Inbox>} Use Inbox object as reference. Reject is simply a string
   */
  getInbox(): Promise<Inbox> {
    return new Promise((resolve, reject) => {
      this.getRequest('/inbox').subscribe(
        (res) => {
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
   * Gets authentcatied users inbox and structures object based on Inbox class for reference.
   * @return {Promise<Inbox>} Use Inbox object as reference. Reject is simply a string
   */
  getInboxPage(page: string): Promise<Inbox> {
    return new Promise((resolve, reject) => {
      this.getRequest('/inbox&page=' + page).subscribe(
        (res) => {
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
 * Gets authentcatied users pm box and structures object based on Inbox class for reference.
 * @return {Promise<Inbox>} Use Inbox object as reference. Reject is simply a string
 */
  getPMBox(index: string): Promise<Inbox> {
    return new Promise((resolve, reject) => {
      this.getRequest('/pmbox/' + index).subscribe(
        (res) => {
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
* Gets authentcatied users pm box and structures object based on Inbox class for reference.
* @return {Promise<Inbox>} Use Inbox object as reference. Reject is simply a string
*/
  getPMBoxPage(index: string, page: number): Promise<Inbox> {
    return new Promise((resolve, reject) => {
      this.getRequest('/pmbox/' + index + '&page=' + page).subscribe(
        (res) => {
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
* Gets authentcatied users message and structures object based on Inbox class for reference.
* @return {Promise<Message>} Use Inbox object as reference. Reject is simply a string
*/
  getMessage(index: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      this.getRequest('/pm/' + index).subscribe(
        (res) => {
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
   * Gets user by uid and structures object based on User class for reference.
   * @return {Promise<User>} Use User object as reference. Reject is simply a string
   */
  getUser(uid: number): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRequest('/user/' + uid).subscribe(
        (res) => {
          console.log(res);
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
  * Gets users by uids and structures object based on Users class for reference.
  * @return {Promise<Users>} Use Users object as reference. Reject is simply a string
  */
  getUsers(uids: number[]): Promise<Users> {
    return new Promise((resolve, reject) => {
      this.getRequest('/users/' + uids.join()).subscribe(
        (res) => {
          console.log(res);
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.uids);
        }
      );
    });
  }

  /**
   * Gets categories and structures object based on 
   * @return {Promise<Category>}
   */
  getCategories(): Promise<Category> {
    return new Promise((resolve, reject) => {
      this.getRequest('/category').subscribe(
        (res) => {
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
   * Gets categories and structures object based on 
   * @return {Promise<Category>}
   */
  getCategory(fid: string): Promise<Category> {
    return new Promise((resolve, reject) => {
      this.getRequest('/category/' + fid).subscribe(
        (res) => {
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
   * Gets categories and structures object based on 
   * @return {Promise<Forum>}
   */
  getForum(fid: string): Promise<Forum> {
    return new Promise((resolve, reject) => {
      this.getRequest('/forum/' + fid).subscribe(
        (res) => {
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }
  /**
   * Gets categories and structures object based on 
   * @return {Promise<Forum>}
   */
  getForumPage(fid: string, page: number): Promise<Forum> {
    return new Promise((resolve, reject) => {
      this.getRequest('/forum/' + fid + '&page=' + page).subscribe(
        (res) => {
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
   * Gets categories and structures object based on 
   * @return {Promise<Groups>}
   */
  getGroups(): Promise<Groups> {
    return new Promise((resolve, reject) => {
      this.getRequest('/groups').subscribe(
        (res) => {
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
   * Gets user by uid and structures object based on User class for reference.
   * @return {Promise<User>} Use User object as reference. Reject is simply a string
   */
  getUserSelf(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRequest('/user').subscribe(
        (res) => {
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
   * Gets user by uid and structures object based on User class for reference.
   * @return {Promise<Threadlist>} Use User object as reference. Reject is simply a string
   */
  getUserThreads(uid: string): Promise<Threadlist> {
    return new Promise((resolve, reject) => {
      this.getRequest('/user/' + uid + '/threads').subscribe(
        (res) => {
          console.log(res);
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
   * Gets thread by tid and structures object based on User class for reference.
   * @return {Promise<Thread>} Use Thread object as reference. Reject is simply a string
   */
  getThread(tid: string): Promise<Thread> {
    return new Promise((resolve, reject) => {
      this.getRequest('/thread/' + tid).subscribe(
        (res) => {
          console.log(res);
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }
  /**
 * Gets thread by tid and structures object based on User class for reference.
 * @return {Promise<Thread>} Use Thread object as reference. Reject is simply a string
 */
  getThreadPage(tid: string, page: number): Promise<Thread> {
    return new Promise((resolve, reject) => {
      this.getRequest('/thread/' + tid + '&page=' + page).subscribe(
        (res) => {
          console.log(res);
          if (!res.success) {
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

  /**
   * Gets thread by tid and structures object based on User class for reference.
   * @return {Promise<Thread>} Use Thread object as reference. Reject is simply a string
   */
  getThreadRaw(tid: string): Promise<Thread> {
    return new Promise((resolve, reject) => {
      this.getRequest('/thread/' + tid + '?raw').subscribe(
        (res) => {
          console.log(res);
          if (!res.success) {
            reject(res.message);
          }
          resolve(res.result);
        }
      );
    });
  }


}
