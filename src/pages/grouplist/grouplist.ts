import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
/* import {Validators, FormBuilder, FormGroup } from '@angular/forms'; */
import { GChatPage } from '../groupchat/groupchat'; 
 
@Component({ 
  selector: 'page-grouplist',
  templateUrl: 'grouplist.html'
})

export class grouplistPage {
 
  public user_id:any;
	public newsData:any;
	public finalresult:any;
	constructor(public navCtrl: NavController,public http:Http,public storage: Storage,public loadingCtrl: LoadingController) {
	let loading = this.loadingCtrl.create({
			content: 'Please wait...'
		  });
		  
	
		  loading.present();
		  
	/* let finalresult = []; */
	var that = this;
		var headers:any = new Headers();
		headers.append('Content-Type', 'application/json');
		that.storage.get('user_id').then((val) => {
			that.user_id = val;
			/* let data=JSON.stringify({action: 'get_userlist',user_id: that.user_id,designation: 'Staff'}); */
			that.http.get('https://chat.emailcipher.com:8081/api/chat/GetEdges?userId='+that.user_id+'',headers)
			.map(res => res.json()) 
			.subscribe(res => {
			  that.newsData=res;
				let cluster = [];
				let i = 0;
				if(res)
				{
				res.forEach( r => {
					i++;
					if(r.Type == '2')
					{
						
						cluster.push(r);
					}
					if(i == res.length) that.finalresult=cluster;
				});
					loading.dismiss();
				}

		}, (err) => {
			loading.dismiss();
			alert('Something is wrong');
		});  
		});
	}
	
	chatview(event, item) {
		this.navCtrl.push(GChatPage, {
			item: item
		}); 
	}
}