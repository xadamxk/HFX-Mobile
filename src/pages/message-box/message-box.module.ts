import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageBoxPage } from './message-box';

@NgModule({
  declarations: [
    MessageBoxPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageBoxPage),
  ],
})
export class MessageBoxPageModule {}
