import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IDB } from '../services/idb.service';
import { IndieSquareActivity } from '../extends/indiesquare.extend';

@Component({
  selector: 'application',
  templateUrl: '../templates/app.template.html',
  styleUrls: ['../sass/app.scss']
})
export class AppComponent extends IndieSquareActivity {
  public data: Object;
  public title = 'Address Book';
  
  constructor( router: Router ){
		super(router);
		let self = this;
		let loading = setInterval(function(){
			if( self.idb.prepared ){
				console.log('IDB prepared');
				clearInterval(loading);
				self.start();
			}
		}, 100);
  }
  
  start(){
		let self = this;
		
		this.idb.getByKey('owner', function(user, error){
			if( error ){
				console.error(error);
				return;
			}
			
			if( user.address != undefined ){
				self.data = user;
				self.router.navigate(['list']);
			}
			else {
				self.router.navigate(['index']);
			}
		});
	}
	
	resync(){
		let self = this;
		self.router.navigate(['index']);
	}
}