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
                                                artical_title  : data.title,
                                                artical_content: data.disp_content});
                }
                else
                {
                    res.render('artical_view', {username:  "", 
                                                isLogged:  false, 
                                                welcome_message:welmsg,
                                                artical_title  : data.title,
                                                artical_content: data.disp_content});
                }
            }
        });    

    console.log("user controller get_artical() }");
};

exports.get_artical_to_edit = function(req, res)
{
    console.log("user controller get_artical_to_edit() {");
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
                    console.log(data.edit_content);
                    res.render('artical_edit', {username             : req.session.username, 
                                                isLogged             : true, 
                                                welcome_message      : welmsg,
                                                param_art_id         : arg.artical_id,                                                
                                                param_disp_art_title : data.title,
                                                value_art_title      : data.title,
                                                param_edit_content   : data.edit_content,
                                                param_disp_content   : data.disp_content});
                }
                else
                {
                    // Not login to home
                    res.redirect('/');
                }
            }
        });    

    console.log("user controller get_artical_to_edit() }");
};

exports.get_artical_to_remove = function(req, res)
{
    console.log("user controller get_artical_to_edit() {");
    var arg = URL.parse(req.url, true).query; 

    if (req.session.user)
        welmsg = "Welcome " +  req.session.username;
    else
        welmsg = "";


    Artical.remove( { artical_id : arg.artical_id} )
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
                Artical.find({username:req.session.username}, ['artical_id', 'username', 'title', 'timestamp'])
                .exec(function(err, data)
                    {
                        console.log("get_all_mine_artical Artical.find exec")
                        if (err)
                        {
                            // TODO: get artical faile how to jump
                            console.log(err);
                            res.session.error = err;
                            res.redirect('/');
                        }
                        else
                        {
                            console.log("get_all_mine_artical Artical.find exec Success");
                            //console.log(data);
                            if (req.session.user)
                            {
                                res.render('artical_manager', 
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
            }
        });    

    console.log("user controller get_artical_to_edit() }");
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
            //console.log("get_all_artical Artical.find exec")
            if (err)
            {
                // TODO: get artical faile how to jump
                console.log(err);
                res.session.error = err;
                res.redirect('/');
            }
            else
            {
                //console.log("get_all_artical Artical.find exec Success");
                //console.log(data);
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

exports.get_all_mine_artical = function(req, res)
{
    console.log("user controller get_all_mine_artical() {");
    var arg = URL.parse(req.url, true).query; 

    if (req.session.user)
    {
        welmsg = "Welcome " +  req.session.username;
        Artical.find({username:req.session.username}, ['artical_id', 'username', 'title', 'timestamp'])
        .exec(function(err, data)
            {
                console.log("get_all_mine_artical Artical.find exec")
                if (err)
                {
                    // TODO: get artical faile how to jump
                    console.log(err);
                    res.session.error = err;
                    res.redirect('/');
                }
                else
                {
                    console.log("get_all_mine_artical Artical.find exec Success");
                    //console.log(data);
                    if (req.session.user)
                    {
                        res.render('artical_manager', 
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
    }
    else
        welmsg = "";

    console.log("user controller get_all_mine_artical() }");
};


exports.save_new_artical = function(req, res)
{
    console.log("user controller save_draft() {");
    if (req.session.user)
    {
        var edit_content = req.body.input_val;
        var result_content = md.render(req.body.input_val);
        var oDate = new Date();
        var strDate = oDate.getFullYear().toString() + (oDate.getMonth()+1).toString() + oDate.getDate().toString()
                      + oDate.getHours().toString() + oDate.getMinutes().toString() + oDate.getSeconds().toString();
        var artid = req.session.username + "_" +strDate;


        console.log("artid: " + artid);
        console.log(req.body.btnSave);
        console.log("arttitle: " + req.body.nm_art_title);

        var arts = new Artical({
                                    artical_id: artid,
                                    username  : req.session.username,
                                    title     : req.body.nm_art_title,
                                    type      : req.body.btnSave ,
                                    edit_content   : edit_content,
                                    disp_content   : result_content
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
                    var redirStr = '/artical_view?artical_id='+artid;
                    req.session.msg = "Artical post success";
                    res.redirect(redirStr);
                }
            });
    }

	console.log("user controller save_draft() }");
};


////++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.save_new_artical_froala = function(req, res)
{
    console.log("user controller save_new_artical_froala() {");
    if (req.session.user)
    {
        var edit_content = req.body.editor_content;

        //var result_content = md.render(req.body.input_val);
        var oDate = new Date();
        var strDate = oDate.getFullYear().toString() + (oDate.getMonth()+1).toString() + oDate.getDate().toString()
                      + oDate.getHours().toString() + oDate.getMinutes().toString() + oDate.getSeconds().toString();
        var artid = req.session.username + "_" +strDate;


        console.log("artid: " + artid);
        //console.log(req.body.btnSave);
        console.log("arttitle: " + req.body.nm_art_title);

        var arts = new Artical({
                                    artical_id: artid,
                                    username  : req.session.username,
                                    title     : req.body.nm_art_title,
                                    type      : 'p',//req.body.btnSave ,
                                    edit_content   : edit_content,
                                    disp_content   : edit_content
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
                    var redirStr = '/artical_view?artical_id='+artid;
                    req.session.msg = "Artical post success";
                    res.redirect(redirStr);
                }
            });
    }

    console.log("user controller save_new_artical_froala() }");
};
////++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



exports.save_edit_artical = function(req, res)
{
    console.log("user controller save_edit_artical() {");
    if (req.session.user)
    {
        var edit_content = req.body.input_val;
        var result_content = md.render(req.body.input_val);
        //var oDate = new Date();
        //var strDate = oDate.getFullYear().toString() + (oDate.getMonth()+1).toString() + oDate.getDate().toString()
        //              + oDate.getHours().toString() + oDate.getMinutes().toString() + oDate.getSeconds().toString();

        //var artid = req.session.username + "_" +strDate;

        var artid = req.body.nm_hid_art_id;

        console.log("artid: " + req.body.nm_hid_art_id);
        console.log(req.body.btnSave);
        console.log("arttitle: " + req.body.nm_art_title);
         


        Artical.findOne({artical_id : artid})
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
                    console.log("save_edit_artical Artical.update " + req.body.nm_art_title);

                    var update = data.update({$set:{title: req.body.nm_art_title, 
                                                    type : req.body.btnSave, 
                                                    edit_content : edit_content,
                                                    disp_content : result_content,
                                                    timestamp    : Date.now()
                                               }});

                    update.exec(function(err, results)
                        {
                            if (err)
                            {
                                console.log("save_edit_artical update.exec error");
                                // TODO: get artical faile how to jump
                                console.log(err);
                                res.session.error = err;
                                res.redirect('/');
                            }
                            else
                            {
                                console.log("save_edit_artical update.exec Success");
                                if (req.session.user)
                                {
                                    res.render('artical_manager', 
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
                }
            });
    }

    console.log("user controller save_edit_artical() }");
};

