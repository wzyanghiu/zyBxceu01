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

    app.get('/new_blog', function(req, res)   // TODO: connect with USER
        {
            console.log("route: new_blog");
            if (req.session.user)
            {
                welmsg = "Welcome " +  req.session.username;
                res.render('artical_new', {username: req.session.username, isLogged:true, welcome_message:welmsg});
            }
            else
            {
                welmsg = "";
                res.redirect('signin');
            }
        });

/*
    app.get('/art_mgr', function(req, res)   // TODO: connect with USER
        {
            console.log("route: cls_mgr");
            if (req.session.user)
            {
                welmsg = "Welcome " +  req.session.username;
                res.render('art_mgr', {username: req.session.username, isLogged:true, welcome_message:welmsg});
            }
            else
            {
                welmsg = "";
                res.redirect('signin');
            }
        });
//*/

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
    app.get('/art_mgr', articals.get_all_mine_artical);
    app.get('/art_edit/:artical_id?',articals.get_artical_to_edit);


    app.post('/signup' , users.signup);
    app.post('/signin' , users.signin);
    app.post('/art_save_new',  articals.save_new_artical);
    app.post('/art_save_edit',  articals.save_edit_artical);    
    //app.post('/viewartical',  articals.get_artical);
}