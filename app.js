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
	
	if( ! req.session || ! req.session.auth ) 
		return res.send('you are not logged in'); 
	
	next(); 
	
}; 

var userSession = function(req,res,next){
	
	if( req.session.user ) return next(); 
	
	var user = req.session.auth || {}; 
	console.log('auth data: ', user); 
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
	
	auth.findUser({
		login: 	  req.body.login, 
		password: req.body.password, 
		userType: userType
	}, function(user){
	 	if( ! user ) return res.status('401').send('credentials are incorrect'); 
	 	
	 	console.log(user); 
	 	
	 	req.session.auth = {
	 		username: user.username, 
	 		favorites: [],
	 		bonus: 0
	 	}; 
	 	res.redirect('/mainpage'); 
	}); 
	
}); 

app.get('/login', function(req,res){
	req.session.auth = {userId: 123}; 
	res.redirect('/mainpage'); 
}); 

app.get('/logout', function(req,res){
	req.session.auth = null;  
	req.session.user = null; 
	res.redirect('/'); 
}); 

app.get('/mainpage', authRequired, function(req,res){
	res.send('mainpage'); 
}); 

app.listen(config.app.port, function(){
    console.log('Webmed is started on a port %d', config.app.port); 
}); 