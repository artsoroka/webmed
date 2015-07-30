module.exports = {
	app: {
		port: process.env.WEBMED_PORT || 8080
	},
	session: {
        name: 'webmed', 
        key:  'webmed', 
        cookie: {
            httpOnly: false, 
            secure: false
        },
        secret: 'keyboard cat'
    }, 
    db:{
        host     : 'localhost',
        user     : 'webmedadmin',
        password : 'webmedpassword',
        database : 'webmed'
    }
};