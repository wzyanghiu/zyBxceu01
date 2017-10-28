var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ArticalSchema = new Schema({
	artical_id  : {type : String, unique: true},
    username    : {type : String},
	title       : {type : String},
    type        : {type : String},  // d: draft;  p: public;
    content     : {type : String},
    timestamp   : {type : Date, default:Date.now},
});

mongoose.model('Artical', ArticalSchema);