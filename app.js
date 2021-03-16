const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDb', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(3000, function () {
    console.log("sever started on port 3000");
});


const articleSch = new mongoose.Schema(
    {
        title: { type: String, require: [true, "title field is require"] },
        content: { type: String, require: [true, "content field is require"] }

    }
);

const article = mongoose.model("articles", articleSch);


app.route("/articles")
    .get(function (req, res) {

        article.find(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                res.send(result);
            }
        });

    })
    .post(function (req, res) {

        let postart = new article({
            title: req.body.title,
            content: req.body.content
        });

        postart.save().then(() => console.log("done"));

        article.find(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                res.send(result);
            }
        });

    })
    .delete(function (req, res) {

        article.deleteMany(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send("Delete all post");
            }
        });

    });


app.route("/articles/:artTitle")
    .get(function (req, res) {

        let routtitle = (req.params.artTitle).trim();

        if (routtitle != "") {
            article.findOne({ title: routtitle }, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
        } else {
            res.send("title is empty");
        }
    })
    .put(function (req, res) {
        let routtitle = (req.params.artTitle).trim();

        if (routtitle != "") {
            article.update(
                { title: routtitle },
                { title: req.body.title, content: req.body.content },
                { overwrite: true },
                function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("succesfully update");
                    }
                });
        } else {
            res.send("title is empty");
        }
    })
    .patch(function (req, res) {
        let routtitle = (req.params.artTitle).trim();

        if (routtitle != "") {
            article.update(
                { title: routtitle },
                { $set: req.body },
                function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("succesfully update");
                    }
                });
        } else {
            res.send("title is empty");
        }
    })
    .delete(function (req, res) {

        let routtitle = (req.params.artTitle).trim();

        if (routtitle != "") {

            article.deleteOne({ title: routtitle }, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Delete single post");
                }
            });

        } else {

            res.send("title is empty");

        }


    });
