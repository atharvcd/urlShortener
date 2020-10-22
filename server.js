const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect("mongodb://localhost/urlShortener",
    {
        useNewUrlParser : true,
        useUnifiedTopology : true
    }
);
app.set('view engine','ejs');
app.set('etag', false);
app.use(express.urlencoded({extended : false}));

app.use((req,res,next) =>{
    res.header('Cache-Control','no-cache, private, no-Store, must-revalidate, max-stale = 0, post-check=0, pre-check=0');
    next();
});

app.get("/",async (req,res) => {
    const shortUrls = await ShortUrl.find();
    console.log('Hello!!!   ',JSON.stringify(shortUrls));
    res.render('index', {shortUrls : shortUrls});
});

app.post("/shortUrl",async (req,res) => {
    await ShortUrl.create({
        fullUrl : req.body.fullUrl
    })
    .then((urlRes) => {
        res.json(urlRes);
        res.redirect("/");
    })
    .catch((err) => {
        res.sendStatus(404);
    })
});


app.get("/:shrinkedUrl", 
async (req,res) => {
    const shortUrl = await ShortUrl.findOne({shrinkedUrl : req.params.shrinkedUrl});
    if(!shortUrl){
        return res.sendStatus(404);
    }
    shortUrl.clicks += 1;
    console.log(`${shortUrl.fullUrl} ${shortUrl.clicks}`);
    shortUrl.save();
    res.redirect(shortUrl.fullUrl);
})


app.listen(process.env.PORT || 5000, () =>{
    console.log(`Server started`);
});