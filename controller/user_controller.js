var crypto = require('crypto')
var mongoose = require('mongoose'),
    User = mongoose.model('User');

function hashPW(pwd)
{
	return crypto.createHash('sha256').update(pwd).digest('base64').toString();
};

exports.signup = function(req, res)
{
    console.log("user controller signup() {");

	var user = new User({username:req.body.username});
	user.set('hs_pwd', hashPW(req.body.password));
	user.set('email', req.body.email);
    user.set('artnum', 0);

    console.log(req.body.username + " " + req.body.password + " " + req.body.email);
    console.log(user);

	user.save(function(err)
		{
			if (err)
			{
                console.log(err);
                res.session.error = err;
                res.redirect('/signup');
			}
			else
			{
                req.session.user = user.id;
                req.session.username = user.username;
                req.session.msg = 'Authenticated as ' + user.username;

                console.log('uid = ' + req.session.user + ' session uname=' + req.session.username + "  uname=" + user.username);
                res.redirect('/');
			}
		});
    console.log("user controller signup() }");    
};


exports.signin = function(req, res)
{
    User.findOne({username: req.body.username})
    .exec(function(err, user)
    	{
            console.log("exports.signin");
            console.log("signin: " + req.body.username + " " + req.body.password);            
            if (!user)
            {
                err = 'User NOT Found';
            }
            else if (user.hs_pwd === hashPW(req.body.password))
            {
                console.log("exports.signin success");
                req.session.user = user.id;
                req.session.username = user.username;
                req.session.msg = 'Authenticated as ' + user.username;
                res.redirect('/');
            }
            else
            {
                err = 'Authenticated failed';
            }

            if (err)
            {
                console.log("exports.signin err");
                req.session.regenerate(function()
                    {
                        console.log("signin failed");
                        req.session.msg = err;
                        res.redirect('/');
                    });
            }
    	});
};

exports.signout = function(req, res)
{
    req.session.destroy(function(err) 
        {
            console.log("user controller -> signout()");
            if(err)
            {
                res.json({ret_code: 2, ret_msg: 'log out failed'});
                return;
            }
            res.redirect('/');
        });
    req.session.user = null;
};
