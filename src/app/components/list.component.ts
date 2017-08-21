import { Component, ElementRef } from '@angular/core';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { IndieSquareActivity } from '../extends/indiesquare.extend';

@Component({
  selector: 'application',
  templateUrl: '../templates/list.template.html',
  styleUrls: ['../sass/list.scss']
})
export class ListComponent extends IndieSquareActivity {
    private _el: HTMLElement;
	private user;
	public selectedUser;
	
	public addform;
	public editform;
	
	public isSearchApply: Boolean;
	public isDragging: Boolean;
	
	public searchWord: String;
	private listArray;
	private historyArray;
	private balanceArray;
	
	public isShowAddForm: Boolean;
	public isShowSearchForm: Boolean;
	public isShowHistoryList: Boolean;
	public isShowEditForm: Boolean;
	public isShowAddressData: Boolean;
	public isShowWelcome: Boolean;
	public isShowGlobalLoading: Boolean;
	public isShowSearchButton: Boolean;
	
	constructor( router: Router, el: ElementRef ){
		super(router);
		
		this._el = el.nativeElement;
		this.isSearchApply = false;
		this.isDragging = false;
		this.searchWord = null;
		this.selectedUser = { 'name': '', 'address': '' };
		this.addform = { 'name': '', 'address': '' };
		this.editform = { 'name': '' };
		
		this.isShowAddForm = false;
		this.isShowSearchForm = false;
		this.isShowHistoryList = false;
		this.isShowEditForm = false;
		this.isShowAddressData = false;
		this.isShowWelcome = false;
		this.isShowGlobalLoading = false;
		this.isShowSearchButton = false;
		
		let self = this;
		let loading = setInterval(function(){
			if( self.idb.prepared ){
				console.log('IDB prepared');
				clearInterval(loading);
				
				self.idb.getByKey('owner', function(user, error){
					self.user = user;
					
					let indiesquare = self.IndiesquareSDK;
					indiesquare.getBalances({'source': user.address }, function(balances, error) {
						self.balanceArray = balances;
						console.dir(self.balanceArray);
						
						for(let i = 0; i < balances.length; i++){
							let balance = balances[i];
							if( balance.token === 'BTC' || balance.token === 'XCP' ) continue;
							self._el.querySelector('#tokenlist').innerHTML += '<option>' + balance.token + '</option>';
					    }
					});
					self.listupdate();
				});
			}
		}, 100);
	}
	
	transitionDoButton(){
		let token = (<HTMLInputElement>this._el.querySelector('#tokenlist')).value;
		var indiesquare = this.IndiesquareSDK;
		indiesquare.transition({'screen': 'send', 'token': token, 'destination': this.selectedUser.address });
		this.isShowAddressData = false;
	}
	
	transitionCancelButton(){
		this.isShowAddressData = false;
	}
	
	private chooseUser(user){
		console.log(user);
		this.selectedUser = user;
		this.isShowAddressData = true;
	}
	
	editDoButton(){
		let self = this;
		
		this.selectedUser.name = this.editform.name;
		this.idb.update('list', this.selectedUser, function(result, error){
			console.log('update:'+result+'; error='+error);
			self.isShowEditForm = false;
			self.listupdate();
		});
	}
	
	editCancelButton(){
		this.isShowEditForm = false;
	}
	
	editname(){
		console.log('editname');
		this.editform.name = this.selectedUser.name;
		this.isShowEditForm = true;
	}
	
	addbutton(){
		console.log('showAddForm:' + this.isShowAddForm);
		this.isShowAddForm = !this.isShowAddForm;
	}
	
	private listupdate(){
		let self = this;
		
		console.log('listupdate');
		this.idb.getAll('list', function(users, error){
			if( error ){
				console.error(error);
				return;
			}
			
			self.listArray = users;
			self._el.querySelector('.content-list').innerHTML = '';
			
			if( users.length <= 0 ){
				self.isShowWelcome = true;
			}
			else{
				if( users.length >= 2  ) self.isShowSearchButton = true;
				console.log('self.searchWord='+self.searchWord);
				if( self.searchWord != null ){
					users = users.filter(function(element, index, array) {
						return element.name.indexOf(self.searchWord) >= 0;
					});
					
					self.isSearchApply = true;
				}
				for(let i = 0; i < users.length; i++){
					let user = users[i];
					let ini = user.name.charAt(0).toUpperCase();
					self._el.querySelector('.content-list').innerHTML += `<div class="md-list-item id${user.id}">
			          <div class="md-list-item-left circle indigo">
			            <span class="font-thin text-lg">${ini}</span>
			          </div>
			          <div class="md-list-item-content">
			            <h3 class="text-md">${user.name}</h3>
			            <small class="font-thin">${user.address}</small>
			          </div>
			        </div>`;
			    }
			    for(let i = 0; i < users.length; i++){
				    let user = users[i];
				    self._el.querySelector('.id' + user.id).addEventListener('click', function(){
				        self.chooseUser(users[i]);
			        });
			    }
			}
		});
	}
	
	addDoButton(){
		let self = this;
		
		console.log('add');
		let name = this.addform.name;
		let address = this.addform.address;
		
		let user = null;
		for(let i = 0; i < this.listArray.length; i++){
			if( this.listArray[i].address === address ){
				user = this.listArray[i];
			}
		}
		
		if( user != null ){
			console.log(user);
			self.idb.update('list', { 'id': user.id, 'name': name, 'address': address }, function(result, error){
				if( error ) console.dir(error);
				self.listupdate();
			});
		}
		else{
			this.idb.add('list', { 'name': name, 'address':address }, function(result, error){
				if( error ){
					console.error(error);
					return;
				}
				console.log('update!');
				self.listupdate();
			});
		}
		self.addform.name = self.addform.address = '';
		this.addform.valid = false;
		this.isShowAddForm = false;
		this.isShowWelcome = false;
	}
	
	private selectAddress(data){
		console.log('isShowHistoryList:'+data);
		this.addform.address = data.destination;
		this.isShowHistoryList = false;
	}
	
	private showHistoryList(){
		let self = this;
		//self.isShowHistoryList = false;
		this.isShowGlobalLoading = false;
		this._el.querySelector('.history-content-list').innerHTML = '';
		
		let check = {};
		let filtered = self.historyArray.filter(function(element, index, array) {
			let flag = false;
			if( !check[element.destination] ){
				check[element.destination] = true;
				flag = true;
			}
		    return flag && element.type === 'send' && element.destination != undefined;
		});
		
		for(let i = 0; i < filtered.length; i++){
			let data = filtered[i];
			console.dir(data);
			this._el.querySelector('.history-content-list').innerHTML += `<div class="md-list-item historyid${i}">
	          <div class="md-list-item-content">
	            <h3 class="text-md">${data.destination}</h3>
	            <small class="font-thin">${data.category} ${data.time}</small>
	          </div>
	        </div>`;
	    }
	    
	    for(let i = 0; i < filtered.length; i++){
		    this._el.querySelector('.historyid' + i).addEventListener('touchstart', function(){
		        self.isDragging = false;
	        });
	        this._el.querySelector('.historyid' + i).addEventListener('touchmove', function(){
		        self.isDragging = true;
	        });
		    this._el.querySelector('.historyid' + i).addEventListener('click', function(){
		        if( !self.isDragging ) self.selectAddress(filtered[i]);
	        });
	    }
	}
	
	chooseFromHistoryButton(){
		let self = this;
		console.log('history');
		
		this.isShowHistoryList = true;
		this.isShowGlobalLoading = true;
		
		if( this.historyArray == null ){
			let indiesquare = self.IndiesquareSDK;
			indiesquare.getHistory({'source': this.user.address }, function(data, error) {
				self.historyArray = data;
				self.showHistoryList();
			});
		}
		else this.showHistoryList();
	}
	
	searchDoButton(){
		console.log('searchDoButton');
		this.listupdate();
		this.isShowSearchForm = false;
	}
	
	searchbutton(){
		console.log('showSearchForm:' + this.isShowSearchForm);
		if( this.isSearchApply ){
			this.isSearchApply = false;
			this.searchWord = null;
			this.listupdate();
		}
		else{
			this.isShowSearchForm = !this.isShowSearchForm;
		}
	}
	
	addbutton_qrtest(){
		let self = this;
		let indiesquare = self.IndiesquareSDK;
		var connect = function (data, urlScheme, error) {
		    if (urlScheme) {
			  //document.location = urlScheme;
		    } else {
			  console.log(urlScheme);
		    }
		};
		indiesquare.readQRcode('Address Book', connect, function(qrdata, error) {
			console.log('--readQRcode--');
			console.log(qrdata.data);
		});
	}
}