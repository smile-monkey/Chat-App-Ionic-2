import { Component } from '@angular/core';
/* import { NavController, NavParams } from 'ionic-angular'; */

import { doctorlistPage } from '../doctorlist/doctorlist';
import { stafflistPage } from '../stafflist/stafflist';
import { grouplistPage } from '../grouplist/grouplist';

@Component({
  selector: 'page-list', 
  templateUrl: 'list.html' 
})
 
export class ListPage {
	tab1Root = doctorlistPage;
	tab2Root = stafflistPage; 
	tab3Root = grouplistPage;
	constructor() {

	}
}
