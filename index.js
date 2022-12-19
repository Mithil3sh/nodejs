var express = require("express");
var bodyParser = require("body-parser")
var con = require('./connection');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

con.connect(function (error) {
    if (error) throw error;
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/register.html")
})

app.get('/students', function (req, res) {
    var sql = "select * from students";
    con.query(sql, function (error, result) {
        if (error) console.log(error);
        // console.log(result);
        res.render("students", { students: result })
    })
})

//create
app.post("/", function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var mobnum = req.body.mobnum;

    //Insert method1
    // var sql="INSERT INTO students(name,email,mobnum) VALUES('"+name+"','"+email+"','"+mobnum+"')";

    //Method 2
    // var sql = "INSERT INTO students(name,email,mobnum) VALUES(?,?,?)";
    // con.query(sql, [name, email, mobnum], function (error, result) {
    //     if (error) throw error;
    //     res.send('Student Register Successfull ' + result.insertId);
    // })


    var sql = "INSERT INTO students(name,email,mobnum) VALUES ?";
    var values = [
        [name, email, mobnum]
    ];
    con.query(sql, [values], function (error, result) {
        if (error) throw error;
        // res.send('Student Register Successfull ' + result.insertId);
        res.redirect("/students")
    })


})

//delete
app.get('/delete', function (req, res) {
    var sql = "delete from students where id=?";
    var id = req.query.id;
    con.query(sql, [id], function (error, result) {
        if (error) console.log(error);
        res.redirect("/students");
    })
})

app.get('/edit', function (req, res) {
    var sql = "select * from students where id=?";
    var id = req.query.id;
    con.query(sql, [id], function (error, result) {
        res.render("update", { FormData: result })
    })
})

//update
app.post("/edit", function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var mobnum = req.body.mobnum;
    var id = req.body.id;

    var sql = "UPDATE students set name=?, email=?,mobnum=? where id=?";
    con.query(sql, [name, email, mobnum, id], function (error, result) {
        if (error) throw error;
        res.redirect("/students")
    })
})


//search
app.get('/search_student', function (req, res) {
    var sql = "select * from students";
    var id = req.query.id;
    con.query(sql, [id], function (error, result) {
        if (error) console.log(error);
        res.render("search_students", { students: result })
    })
})

app.get('/search', function (req, res) {
    var name = req.query.name;
    var email = req.query.email;
    var mobnum = req.query.mobnum;

    var sql = "SELECT * from students where name LIKE '%" + name + "%' AND email LIKE '%" + email + "%' AND mobnum LIKE '%" + mobnum + "%'";
    con.query(sql, function (error, result) {
        if (error) console.log(error);
        res.render("search_students", { students: result });
    })
})

app.listen(7000);