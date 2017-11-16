import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'; // https://ionicacademy.com/ionic-qr-code-generator-reader/
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  //
  qrData = null;
  createdCode = null;
  scannedCode = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private storage: Storage,
    private alertCtrl: AlertController) {
    // Get saved API Key
    storage.get('apiKey').then((val) => {
      console.log('Your apiKey is: ', val);
      this.qrData = val;
    });
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
      this.qrData = this.scannedCode;
    }, (err) => {
      console.log('Error: ', err);
    });
  }

  saveChanges() {
    //ToDo
    // set a key/value
  this.storage.set('apiKey', this.qrData);
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
