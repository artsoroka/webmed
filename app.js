var express    	 = require('express');
var session    	 = require('express-session'); 
var bodyParser 	 = require('body-parser');  
var cookieParser = require('cookie-parser');  
var app        	 = express(); 
var config	     = require('./config'); 
var db           = require('./lib/mysql'); 
var auth 		 = require('./lib/auth')(db); 

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser()); 
app.use(session(config.session)); 

app.use(express.static(__dirname + '/public')); 
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views'); 

var authRequired = function(req,res,next){
	var session = req.session || {}; 
	var auth    = session.auth || null; 
	req.session.user = req.session.user || {}; 
	if( ! auth ) 
		return res.send('you are not logged in'); 
	next(); 
}; 

var userSession = function(req,res,next){
	
	if( req.session.user) return next(); 
	
	var user = req.session.auth || {}; 
	
	req.session.user = {
		name: user.username || 'not logged in', 
		favorites: user.favorites || [], 
		bonus: user.bonus || 0
	}; 
	next(); 
}; 
 
app.get('/', userSession, function(req,res){
	res.render('mainpage', {
		user: req.session.user || {} 
	});  
}); 

app.get('/login', function(req,res){
	res.render('auth/login'); 
}); 

app.post('/login/:userType*?', function(req,res){
	var userType = req.params.userType || 'user'; 
	
	if( ! req.body || ! req.body.login || ! req.body.password) 
		return res.status(400).send('no valid login credentials provided '); 
	
	var userTypes = {
		'user':         1, 
		'doctor':       2, 
		'organization': 3, 
		'moderator':    4, 
		'admin':        5
	}; 
	
	db.query('SELECT * FROM users WHERE email = ? AND password = ? AND user_type_id = ?', [
		req.body.login, 
		req.body.password, 
		userTypes[userType]
	], function(err, record){
		if( err ) return res.send(err); 
		
		res.send(JSON.stringify(record)); 
	});  
	
}); 

app.get('/login', function(req,res){
	req.session.auth = {userId: 123}; 
	res.redirect('/mainpage'); 
}); 

app.get('/logout', function(req,res){
	req.session.auth = null;  
	res.redirect('/'); 
}); 

app.get('/mainpage', authRequired, function(req,res){
	res.send('mainpage'); 
}); 

app.listen(config.app.port, function(){
    console.log('Webmed is started on a port %d', config.app.port); 
}); 