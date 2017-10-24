import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HttpModule } from '@angular/http';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { CategoryPage } from '../pages/category/category';
import { ForumsPage } from '../pages/forums/forums';
import { ForumPage } from '../pages/forum/forum';
import { GroupsPage } from '../pages/groups/groups';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { ThreadlistPage } from '../pages/threadlist/threadlist';
import { ThreadPage } from '../pages/thread/thread';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GetCategoriesProvider } from '../providers/get-categories/get-categories';
import { GetForumsProvider } from '../providers/get-forums/get-forums';
import { GetProfileProvider } from '../providers/get-profile/get-profile';
import { GetForumProvider } from '../providers/get-forum/get-forum';
import { GetCategoryProvider } from '../providers/get-category/get-category';
import { GetGroupsProvider } from '../providers/get-groups/get-groups';
import { ApIv1Provider } from '../providers/api-v1/api-v1';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    CategoryPage,
    ForumsPage,
    ForumPage,
    GroupsPage,
    ProfilePage,
    SettingsPage,
    ThreadlistPage,
    ThreadPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    CategoryPage,
    ForumsPage,
    ForumPage,
    GroupsPage,
    ProfilePage,
    SettingsPage,
    ThreadlistPage,
    ThreadPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GetCategoriesProvider,
    GetForumsProvider,
    GetProfileProvider,
    GetForumProvider,
    GetCategoryProvider,
    GetGroupsProvider,
    ApIv1Provider,
    QRScanner
  ]
})
export class AppModule {}
