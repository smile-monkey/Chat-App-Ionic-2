import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { InvitePage } from '../pages/invite/invite';
import { docinvitePage } from '../pages/docinvite/docinvite';
import { staffinvitePage } from '../pages/staffinvite/staffinvite';
import { staffbymailPage } from '../pages/staffbymail/staffbymail';
import { staffbyuserPage } from '../pages/staffbyuser/staffbyuser';
import { doctorlistPage } from '../pages/doctorlist/doctorlist';
import { stafflistPage } from '../pages/stafflist/stafflist';
import { SChatPage } from '../pages/staffchat/staffchat';
import { GChatPage } from '../pages/groupchat/groupchat';
import { grouplistPage } from '../pages/grouplist/grouplist';
import { ChatPage } from '../pages/chat/chat';
import { LogoutPage } from '../pages/logout/logout';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { DbProvider } from '../providers/db/db';
import { ChatSettingsComponent } from '../components/chat-settings/chat-settings';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { OneSignal } from '@ionic-native/onesignal';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    InvitePage,
	docinvitePage,
	staffinvitePage,
	staffbymailPage,
	staffbyuserPage,
	doctorlistPage,
	stafflistPage,
	SChatPage,
	GChatPage,
	grouplistPage,
	ChatPage,
  LogoutPage,
  ChatSettingsComponent
  ],
  imports: [
    BrowserModule,
   HttpModule,
    IonicModule.forRoot(MyApp,{tabsPlacement:'top',tabsHideOnSubPages: true}),
	IonicStorageModule.forRoot()

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
	InvitePage,
	docinvitePage,
	staffinvitePage,
	staffbymailPage,
	staffbyuserPage,
	staffbyuserPage,
	doctorlistPage,
	stafflistPage,
	SChatPage,
	GChatPage,
	grouplistPage,
	ChatPage,
  LogoutPage,
  ChatSettingsComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    LocalNotifications,
    OneSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DbProvider
  ]
})
export class AppModule { }
