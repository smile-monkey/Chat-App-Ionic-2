import { Component } from '@angular/core';
/* import { NavController, NavParams } from 'ionic-angular'; */

import { staffbymailPage } from '../staffbymail/staffbymail';
import { staffbyuserPage } from '../staffbyuser/staffbyuser';

@Component({
  selector: 'page-staffinvite',
  templateUrl: 'staffinvite.html'
})

export class staffinvitePage {
 tab1Root = staffbymailPage; 
  tab2Root = staffbyuserPage;


  constructor() {

  }

}