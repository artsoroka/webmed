var Auth = function(db){
    this.db = db; 
}; 

Auth.prototype.findUser = function(credentials, callback){

	var userTypes = {
		'user':         1, 
		'doctor':       2, 
		'organization': 3, 
		'moderator':    4, 
		'admin':        5
	}; 
	
	this.db.query('SELECT * FROM users WHERE email = ? AND password = ? AND user_type_id = ?', [
		credentials.login, 
		credentials.password, 
		userTypes[credentials.userType]
	], function(err, user){
		if( err ) {
		    console.log('mysql error: ', err);     
		    return callback(null); 
		}
		
		if( ! user || ! user.length )
		    return callback(null); 
		
		callback(user[0]); 
		
	});  
}; 

module.exports = function(db){
    return new Auth(db); 
}; 