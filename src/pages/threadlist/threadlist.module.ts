import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThreadlistPage } from './threadlist';

@NgModule({
  declarations: [
    ThreadlistPage,
  ],
  imports: [
    IonicPageModule.forChild(ThreadlistPage),
  ],
})
export class ThreadlistPageModule {}
