import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import {Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
/* import {Validators, FormBuilder, FormGroup } from '@angular/forms'; */
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-doctorlist',
  templateUrl: 'doctorlist.html'
})

export class doctorlistPage {

  public user_id:any;
	public newsData:any;
	public finalresult:any;
	public response:any;
  constructor(public navCtrl: NavController,public http:Http,public storage: Storage,public loadingCtrl: LoadingController,public menuCtrl: MenuController)
  {
		this.menuCtrl.enable(true);
		let loading = this.loadingCtrl.create({
		  content: 'Please wait...'
		});


		loading.present();

		/* let finalresult = []; */
		var that = this;
		var headers: any = new Headers();
		headers.append('Content-Type', 'application/json');
		that.storage.get('user_id').then((val) => {
		  that.user_id = val;
		  /* let data=JSON.stringify({action: 'get_userlist',user_id: that.user_id,designation: 'Doc'}); */
		  that.http.get('https://chat.emailcipher.com:8081/api/chat/GetEdges?userId=' + that.user_id + '', headers)
		    .map(res => res.json())
		    .subscribe(res => {
		      console.log(res);
		      that.newsData = res;
		      let cluster = [];
		      let i = 0;
		      if (res) {
		        res.forEach(r => {
		          i++;
		          if (r.Type == 0) {
		            cluster.push(r);
		          }
		        });
		        that.finalresult = cluster;
		        loading.dismiss();
		      }


		    }, (err) => {
		      loading.dismiss();
		      that.response = 'Something is wrong';
		    });
		});
  }

		chatview(event, item) {
		  this.navCtrl.push(ChatPage, {
		    item: item
		  });
		}
}
