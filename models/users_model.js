var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username  : {type : String, unique: true},
    email  : {type : String},
    hs_pwd : {type : String},
});


mongoose.model('User', UserSchema);
