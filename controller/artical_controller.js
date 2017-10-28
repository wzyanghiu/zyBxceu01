var URL = require('url');

var mongoose = require('mongoose'),
    Artical = mongoose.model('Artical'),
    User = mongoose.model('User'),
    MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();

exports.get_artical = function(req, res)
{
    console.log("user controller get_artical() {");
    var arg = URL.parse(req.url, true).query; 

    if (req.session.user)
        welmsg = "Welcome " +  req.session.username;
    else
        welmsg = "";

    Artical.findOne( { artical_id : arg.artical_id} )
    .exec(function(err, data)
        {
            if (err)
            {
                // TODO: get artical faile how to jump
                console.log(err);
                res.session.error = err;
                res.redirect('/');
            }
            else
            {
                if (req.session.user)
                {
                    res.render('artical_view', {username:  req.session.username, 
                                                isLogged:  true, 
                                                welcome_message:welmsg,
                                                artical_content: data.content});
                }
                else
                {
                    res.render('artical_view', {username:  "", 
                                                isLogged:  false, 
                                                welcome_message:welmsg,
                                                artical_content: data.content});
                }
            }
        });    

    console.log("user controller get_artical() }");
};

exports.get_all_artical = function(req, res)
{
    console.log("user controller get_all_artical() {");
    var arg = URL.parse(req.url, true).query; 

    if (req.session.user)
        welmsg = "Welcome " +  req.session.username; 
    else
        welmsg = "";

    Artical.find({type:'p'}, ['artical_id', 'username', 'title', 'timestamp'])
    .exec(function(err, data)
        {
            console.log("get_all_artical Artical.find exec")
            if (err)
            {
                // TODO: get artical faile how to jump
                console.log(err);
                res.session.error = err;
                res.redirect('/');
            }
            else
            {
                console.log("get_all_artical Artical.find exec Success");
                console.log(data);
                if (req.session.user)
                {
                    res.render('artical_list', 
                                  { username : req.session.username, 
                                    isLogged :true, 
                                    welcome_message:welmsg,
                                    art_data:data});
                }
                else
                {
                    res.render('artical_list', {username: "", isLogged:false, welcome_message:welmsg, art_data:data});
                }
            }
        });    

    console.log("user controller get_all_artical() }");
};


exports.save_draft = function(req, res)
{
    console.log("user controller save_draft() {");
    if (req.session.user)
    {
        var result_content = md.render(req.body.input_val);
        var oDate = new Date();
        var strDate = oDate.getFullYear().toString() + (oDate.getMonth()+1).toString() + oDate.getDate().toString()
                      + oDate.getHours().toString() + oDate.getMinutes().toString() + oDate.getSeconds().toString();
        var artid = req.session.username + "_" +strDate;


        console.log("artid: " + artid);
        console.log(req.body.btnSave);

        var arts = new Artical({
                                    artical_id: artid,
                                    username  : req.session.username,
                                    title     : req.body.art_title,
                                    type      : req.body.btnSave ,
                                    content   : result_content
                                });

        arts.save(function(err)
            {
                // TODO: err and success jump page
                if (err)
                {
                    console.log(err);
                    res.session.error = err;
                    res.redirect('/');
                }
                else
                {
                    console.log("Update User success: " + artid);
                    var redirStr = '/artical_view?artical_id='+artid;    // ok

                    //console.log(redirStr);
                    req.session.msg = "Artical post success";
                    res.redirect(redirStr);
                }
            });
    }

	console.log("user controller save_draft() }");
};

