var express = require('express');


module.exports = function(app)
{
    var users = require('./controller/user_controller');
    var articals = require('./controller/artical_controller');

    var welmsg = "";
    app.use('/static', express.static('./static'))
       .use('/images',  express.static('./images'))
       .use('/views',  express.static('./views'));

    app.get('/', function(req, res)
    	{
            if (req.session.user)
            {
                
                welmsg = "Welcome " +  req.session.username;
                res.render('index', {username: req.session.username, isLogged:true, welcome_message:welmsg});
            }
            else
            {
                welmsg = "";
                res.render('index', {username: "", isLogged:false, welcome_message:welmsg});
            }
    	});

/*
    app.get('/art_list', function(req, res)   // TODO
        {
            console.log("current_condation");
            if (req.session.user)
            {
                
                welmsg = "Welcome " +  req.session.username;
                res.render('artical_list', {username: req.session.username, isLogged:true, welcome_message:welmsg});
            }
            else
            {
                welmsg = "";
                res.render('artical_list', {username: "", isLogged:false, welcome_message:welmsg});
            }
        });
//*/

    app.get('/new_blog', function(req, res)   // TODO: connect with USER
        {
            console.log("route: new_blog");
            if (req.session.user)
            {
                welmsg = "Welcome " +  req.session.username;
                res.render('md_edit', {username: req.session.username, isLogged:true, welcome_message:welmsg});
            }
            else
            {
                welmsg = "";
                res.render('sign_in');
            }
        });

    app.get('/signup', function(req, res)
        {
            console.log("route: signup  { ");
            if (req.session.user)
            {
                console.log("route: signup  redirect root");
                res.redirect('/');
            }
            else
            {
                console.log("route: signup  res.render sign_up");
                res.render('sign_up');
            }
            console.log("route: signup  }");
        });

    app.get('/signin', function(req, res)
        {
            console.log("route: signin  { ");
            if (req.session.user)
            {
                console.log("route: signin  redirect root");
                res.redirect('/');
            }
            else
            {
                console.log("route: signin  res.render sign_in");
                res.render('sign_in');
            }
            console.log("route: signin  }");
        });
    app.get('/signout', function(req, res)
        {
            console.log("route: signout  { ");
            if (req.session.user)
            {
                req.session.destroy(function(err) 
                    {
                        console.log("user controller -> signout()");
                        if(err)
                        {
                            return;
                        }
                    });
                res.redirect('/');
            }
            else
            {
                res.redirect('/');
            }
            console.log("route: signout  }");
        });

    app.get('/artical_view/:artical_id?',articals.get_artical);
    app.get('/art_list', articals.get_all_artical);


    app.post('/signup' , users.signup);
    app.post('/signin' , users.signin);
    app.post('/savedraft',  articals.save_draft);
    //app.post('/viewartical',  articals.get_artical);
}