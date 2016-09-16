var express = require('express');
var app = express();
var questions = require('./public/questions.js');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function (user,done){
	done(null,user);
});

passport.deserializeUser(function (obj,done){
	done(null,obj);
});

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: "658338849323-rh74q0mk9e43pvd6gua16u9oqdd9mh6k.apps.googleusercontent.com",
    clientSecret: "Hx-wsaCau-bxHNEiiUaiI0AY",
    callbackURL: "http://port-8000.nodejs-zehata559500.codeanyapp.com/auth/google/callback"
  },
  function(request, accessToken, refreshToken, profile, done) {
		process.nextTick(function(){
			return done(null, profile);
		})
  }
));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
		passport.authenticate('google', { scope: 
				['https://www.googleapis.com/auth/plus.login']}
));

app.get('/auth/google/callback',
			 passport.authenticate('google', { successRedirect: '/quiz', failureRedirect: '/login'
	}
));

app.get('/',function(req, res){
  res.sendFile(path.join(__dirname+'./public/index.html'));
});

app.get('/login', function(req, res){
	res.sender('login',{user:req.user});
});

app.get('/account', ensureAuthenticated, function (req, res){
	res.sender('account', {user: req.user});
});

app.get('/logout', function (req, res){
	req.logout();
	res.redirect('/');
});

app.get('/quiz', function (req,res){
	app.use(express.static('public'));
	res.sendFile('public/quiz.html', {root: __dirname });
});

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()) { return next(); }
// 	res.redirect('/login');
}

app.listen(process.env.PORT);
