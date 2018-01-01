var express = require('express');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var URL = require('url');

const uuidv1 = require('uuid/v1');

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
                res.render('artical_new_froala', {username: req.session.username, isLogged:true, welcome_message:welmsg, ret_url:""});                
            }
            else
            {
                welmsg = "";
                res.redirect('signin');
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
    app.get('/art_mgr', articals.get_all_mine_artical);
    app.get('/art_edit/:artical_id?',articals.get_artical_to_edit);
    app.get('/art_edit_rm/:artical_id?',articals.get_artical_to_remove);
    app.get('/uploads/:pic_file_name?', function(req, res)
        { 
            var arg = URL.parse(req.url, true).query; 
            var img = fs.readFileSync('./uploads/' + arg.pic_file_name); 
            res.writeHead(200, {'Content-Type': 'image/jpeg' }); 
            res.end(img, 'binary'); 
        });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    app.post('/froala_save', articals.save_new_artical_froala);
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    app.post('/signup' , users.signup);
    app.post('/signin' , users.signin);
    app.post('/art_save_new',  articals.save_new_artical);
    app.post('/art_save_edit',  articals.save_edit_artical);
    app.post('/uploads', function(req, res)   // TODO: connect with USER
        {
            console.log("app.post upload {");
            // create an incoming form object
            var form = new formidable.IncomingForm();
            var strFileName = uuidv1();
            var extName = "";
            form.multiples = true;
            var retUrl = "";

            form.uploadDir = path.join(__dirname, '/uploads');

            // every time a file has been uploaded successfully,
            // rename it to it's orignal name
            form.on('file', function(field, file)
                {
                    //console.log(file);
                    switch (file.type) 
                    {
                        case "image/pjpeg":
                            extName = "jpg";
                            break;
                        case "image/jpeg":
                            extName = "jpg";
                            break;         
                        case "image/png":
                            extName = "png";
                            break;
                        case "image/x-png":
                            extName = "png";
                            break;
                    }

                    console.log("Upload URL: " + form.uploadDir + "\\" + strFileName +"."+extName);
                    strFileName = strFileName + "."+extName;
                    fs.renameSync(file.path, path.join(form.uploadDir, strFileName));
                });
            // log any errors that occur
            form.on('error', function(err) 
                {
                    console.log('An error has occured: \n' + err);
                });

            // once all the files have been uploaded, send a response to the client
            form.on('end', function() 
                {

                    retUrl = "http://127.0.0.1/uploads?pic_file_name=" + strFileName;
                    var data = {link: retUrl};
                    
                    console.log('upload success : ' + retUrl);
                    res.end(JSON.stringify(data))                     
                });

            form.parse(req);


	   });
}