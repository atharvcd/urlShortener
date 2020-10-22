const mongoose = require('mongoose');
const shortid = require('shortid');
const shortUrlSchema = new mongoose.Schema({
    fullUrl : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    shrinkedUrl : {
        type : String,
        required : true,
        default : shortid.generate
    },
    clicks : {
        type : Number,
        required : true,
        default : 0
    }
});

module.exports = mongoose.model("ShortUrl",shortUrlSchema);
