import { Component } from '@angular/core';
/* import { NavController, NavParams } from 'ionic-angular'; */

import { staffinvitePage } from '../staffinvite/staffinvite';
import { docinvitePage } from '../docinvite/docinvite';

@Component({
  selector: 'page-invite',
  templateUrl: 'invite.html'
})

export class InvitePage { 

  tab2Root = staffinvitePage;
  tab3Root = docinvitePage;


  constructor() {

  }
}