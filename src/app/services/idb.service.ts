import { AngularIndexedDB } from 'angular2-indexeddb';

export class IDB {
	private dbname = 'addressbook';
	private dbver = 1;
	
	prepared: Boolean;
	db: AngularIndexedDB;
	
	constructor(){
		let self = this;
		this.prepared = false;
		
		this.db = new AngularIndexedDB(this.dbname, this.dbver);
		//this.destroy();
		let cb = this.db.createStore(this.dbver, (evt) => {
			let owner = evt.currentTarget.result.createObjectStore('owner', { keyPath: 'id', autoIncrement: true });
			owner.createIndex('name', 'name', { unique: true });
			owner.createIndex('address', 'address', { unique: false });
			owner.add({'name': '', 'address': undefined});
			
			let list = evt.currentTarget.result.createObjectStore('list', { keyPath: 'id', autoIncrement: true });
			list.createIndex('name', 'name', { unique: true });
			list.createIndex('address', 'address', { unique: false });
		});
		cb.then(function(){
			self.prepared = true;
		});
	}
	
	getAll( store: string, callback: Function ){
		console.log('getAll: ' + store);
		this.db.getAll(store).then((data) => {
		    console.dir(data);
		    callback(data, null);
		}, (error) => {
		    callback(null, error);
		});
	}
	
	getByKey( store: string, callback: Function ){
		console.log('getByKey: ' + store);
		let n = 1;
		this.db.getByKey(store, n).then((data) => {
			console.dir(data);
		    callback(data, null);
		}, (error) => {
		    callback(null, error);
		});
	}
	
	getByIndex( store: string, index: string, key: string, callback: Function ){
		console.log('getByKey: ' + store);
		this.db.getByIndex(store, index, key).then((data) => {
			console.dir(data);
		    callback(data, null);
		}, (error) => {
		    callback(null, error);
		});
	}
	
	add( store: string, value, callback: Function ){
		console.log('add: ' + store);
		console.log(value);
		this.db.add(store, value).then(() => {
		    callback(true, null);
		}, (error) => {
		    callback(null, error);
		});
	}
	
	update( store: string, value, callback: Function ){
		console.log('getByKey: ' + store);
		this.db.update(store, value).then(() => {
			callback(true, null);
		}, (error) => {
			callback(false, error);
		});
	}
	/*
	remove( store: string, key: string, callback: Function ){
		console.log('remove: ' + store + '; key: '+key);
		this.db.remove(store, key).then(() => {
			callback(true, null);
		}, (error) => {
			callback(false, error);
		});
	}
	*/
	destroy(){
		console.log('destroy');
		
		var req = window.indexedDB.deleteDatabase(this.dbname);
		req.onsuccess = function(){
		    console.log("Deleted database successfully");
		};
		req.onerror = function(){
		    console.log("Couldn't delete database");
		};
		req.onblocked = function(){
		    console.log("Couldn't delete database due to the operation being blocked");
		};
	}
}