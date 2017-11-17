import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApIv1Provider } from '../../providers/api-v1/api-v1';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfilePage } from '../profile/profile';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
  providers: [ApIv1Provider]
})
export class MessagePage {

  private message;
  private messageArray = [];
  private senderUsername;
  private senderUID;
  private receiverUsername;
  private receiverUID;
  private messageDate;
  private messageSubject;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiv1: ApIv1Provider,
    private sanitizer: DomSanitizer,
  ) {
    console.log(this.navParams);
    apiv1.getMessage(this.navParams.get('pmid')).then(
      (res) => {
        console.log(res);
        this.message = res.message;
        this.senderUsername = res.fromusername;
        this.senderUID = res.from;
        this.receiverUsername = res.tousername;
        this.receiverUID = res.to;
        this.messageDate = res.dateline;
        this.messageSubject = res.subject;
        this.messageArray = this.parsePMPretty(this.message);
        // Messages
        for (var i = 0; i < this.messageArray.length; i++) {
          // Trim first br from each message (not working)
          var removedBr = false;
          for (var j = 0; j < this.messageArray[i][2].length; j++) {
            if (!removedBr && this.messageArray[i][2][j].includes('<br />')) {
              this.messageArray[i][2][j] = this.messageArray[i][2][j].replace('<br />', '');
              removedBr = true;
            }
          }
          // Join message strings
          this.messageArray[i][2] = this.messageArray[i][2].join('');
          // Remove blockquote html
          this.messageArray[i][2] = this.replaceAll(this.messageArray[i][2], '<blockquote class="mycode_quote">', ' ');
          // Replace first line break
          this.messageArray[i][2] = this.messageArray[i][2].replace('<br />', '');
          
          
        }
        //console.log(this.messageArray);

      },
      (reject) => {
        console.error(reject);
        apiv1.displayErrorMessage(reject);
      }
    );
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MessagePage');
  }

  parsePMPretty(message) {
    var tempArray = [], originalAuthor, authorList = [], i, docSplit, newAuthor, finalArray = [], tempvar, quoteLink;
    docSplit = message;
    docSplit = this.trimString(docSplit);
    docSplit = this.replaceAll(docSplit, ">", ">\n");
    docSplit = this.replaceAll(docSplit, "</blockquote>", "\n</blockquote>");
    docSplit = docSplit.split('\n');

    //debugPrint(docSplit);

    originalAuthor = this.senderUsername;
    tempArray[tempArray.length] = [originalAuthor, 1, []];
    authorList.push(originalAuthor);
    //debugPrint("Current status of temparray: "+tempArray);

    for (i = 0; i < docSplit.length; i++) {
      if (docSplit[i].indexOf("Wrote:</cite>") != -1 && docSplit[i - 1].indexOf("<cite>") != -1) {
        newAuthor = docSplit[i].split(" Wrote:")[0];
        if (tempArray.length == 1 && tempArray[0][2].length > 0) {
          tempvar = tempArray.pop();
          finalArray.push(tempvar);
          tempArray.push([originalAuthor, 1, []]);
        }
        tempArray.push([newAuthor, 0, []]);
        authorList.push(newAuthor);
      } else if (docSplit[i].indexOf("Quote:</cite>") != -1 && docSplit[i - 1].indexOf("<cite>") != -1) {
        newAuthor = 'Unattributed Quote';
        if (tempArray.length == 1 && tempArray[0][2].length > 0) {
          tempvar = tempArray.pop();
          finalArray.push(tempvar);
          tempArray.push([originalAuthor, 1, []]);
        }
        tempArray.push([newAuthor, 0, []]);
        authorList.push(newAuthor);
      } else if (docSplit[i].indexOf('hr style="width: 20%;background: #000') != -1) {
        tempvar = tempArray.pop();
        finalArray.push(tempvar);
        return finalArray;
      } else if (docSplit[i].indexOf("Wrote:") != -1) {
        if (docSplit.length >= 2) {
          if (docSplit[i - 2].indexOf('span') != -1) {
            newAuthor = docSplit[i].split(' Wrote:')[0];
            quoteLink = '/' + docSplit[i].split('="')[1].split('" ')[0].split('/')[3];
            if (tempArray.length == 1 && tempArray[0][2].length > 0) {
              tempvar = tempArray.pop();
              finalArray.push(tempvar);
              tempArray.push([originalAuthor, 1, []]);
              tempArray.push([newAuthor, 1, ['<small><i>Quoted post from <a href="' + quoteLink + '">here</a></i></small>']]);
            } else {
              tempArray.push([newAuthor, 0, ['<small><i>Quoted post from <a href="' + quoteLink + '">here</a></i></small>']]);
            }
            authorList.push(newAuthor);
          } else {
            tempArray[tempArray.length - 1][2].push(docSplit[i]);
          }
        } else {
          tempArray[tempArray.length - 1][2].push(docSplit[i]);
        }
      } else if (docSplit[i].indexOf("</blockquote>") != -1) {
        tempvar = tempArray.pop();
        authorList.pop();
        finalArray.push(tempvar);
      } else if (docSplit[i] != "" && docSplit[i].indexOf("<blockquote>") != 0 && docSplit[i].indexOf("<cite>") != 0 && docSplit[i].indexOf("<br>") != 0) {
        if (i >= 1) {
          if (docSplit[i - 1].indexOf("<span") != 0 || docSplit[i - 1].indexOf('style=') != -1) {
            tempArray[tempArray.length - 1][2].push(docSplit[i]);
          }
        } else {
          tempArray[tempArray.length - 1][2].push(docSplit[i]);
        }
      }
    }
    tempvar = tempArray.pop();
    finalArray.push(tempvar);
    return finalArray;
  }

  trimString(str) {
    /* Also didn't write this, but it's very useful and so elegant! */
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }

  replaceAll(str, find, replace) {
    /* I didn't write this, but it's damn useful */
    return str.replace(new RegExp(find, 'g'), replace);
  }

  assembleHTMLItem(htmlString) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  formatDate(input) {
    var example = new Date(input);
    var date = example.toDateString();
    var timeOptions = {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit'
    }
    var time = example.toLocaleString('en-US', timeOptions);
    var finalFormat = date + ', ' + time;
    return finalFormat;
  }

  launchProfilePageSender(message) {
    //console.log(thread);
    if (!message.user) {
      message['user'] = this.senderUID;
    }
    this.navCtrl.push(ProfilePage, message);
  }

  launchProfilePageReceiver(message) {
    console.log(message);
    if (!message.user) {
      message['user'] = this.receiverUID;
    }
    this.navCtrl.push(ProfilePage, message);
  }


}
