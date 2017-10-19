import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

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

@Injectable()
export class ApIv1Provider {

  private apiUrl: string = 'https://hackforums.net/api/v1';
  private apiKey: string = ''; //set default key or call set key method.

  public headers: Headers;
  public options: RequestOptions;

  constructor(public http: Http) {
    //console.log('Hello ApIv1Provider Provider');
    /*
      Typically you'd use a StorageProvider (LocalStorage) to keep the apikey for the user stored on there device for accessing later.
      However in this example I have embeded the key in a variable above, and added the setKey method.
     */

    let key = 'jnvoQiYBVHycI2FecJyMIyYr7HYR4nL7';
    this.setKey(key); //Set key.
  }

  /**
   * Sets API Key
   * @param  {string} key API Key provided by https://hackforums.net/apikey.php
   * @return
   */
  setKey(key: string){
    this.apiKey = key;
    return this.setHeaders();
  }

  /**
   * Using setHeaders method to add all headers dynamically to requests.
   * @return {Promise}
   */
  setHeaders() : Promise<boolean> {
    return new Promise((resolve, reject) => {
      let apiKeyEncoded = window.btoa(this.apiKey+":");
      this.headers = new Headers({
        'Authorization': 'Basic ' + apiKeyEncoded
      });
      this.options = new RequestOptions({ headers: this.headers });
      resolve(true); //Finished setting variables
    });
  }

  getRequest(url: string) : any {
    console.log('url: ' + url);
    return this.http.get(this.apiUrl + url, this.options).map(res => res.json());
  }

  postRequest(url: string, data: any) : any {
    console.log('url: ' + url);
    return this.http.post(this.apiUrl + url, data, this.options).map(res => res.json());
  }

  /**
   * Gets authentcatied users inbox and structures object based on Inbox class for reference.
   * @return {Promise<Inbox>} Use Inbox object as reference. Reject is simply a string
   */
  getInbox() : Promise<Inbox> {
    return new Promise((resolve,reject) => {
      this.getRequest('/inbox').subscribe(
        (res) => {
          if (!res.success){
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
  getUser(uid: number) : Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRequest('/user/'+uid).subscribe(
        (res) => {
          if (!res.success){
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
  getCategories() : Promise<Category> {
    return new Promise((resolve, reject) => {
      this.getRequest('/category').subscribe(
        (res) => {
          if (!res.success){
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
  getCategory(fid: string) : Promise<Category> {
    return new Promise((resolve, reject) => {
      this.getRequest('/category/'+ fid).subscribe(
        (res) => {
          if (!res.success){
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
  getForum(fid: string) : Promise<Forum> {
    return new Promise((resolve, reject) => {
      this.getRequest('/forum/'+ fid).subscribe(
        (res) => {
          if (!res.success){
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
  getGroups() : Promise<Groups> {
    return new Promise((resolve, reject) => {
      this.getRequest('/groups').subscribe(
        (res) => {
          if (!res.success){
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
  getUserSelf() : Promise<User> {
    return new Promise((resolve, reject) => {
      this.getRequest('/user').subscribe(
        (res) => {
          if (!res.success){
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
  getUserThreads(uid: string) : Promise<Threadlist> {
    return new Promise((resolve, reject) => {
      this.getRequest('/user/'+uid+'/threads').subscribe(
        (res) => {
          if (!res.success){
            reject(res.message);
          }

          resolve(res.result);
        }
      );
    });
  }

}
