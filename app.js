const express = require('express');
const app = express();
const hbs = require('hbs');
const mysql = require('mysql');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Console } = require('console');
const port = process.env.port || 1010;
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.use("/css", express.static("css"));
app.use(express.urlencoded());
app.set('view engine', 'hbs');
app.set('views', 'views');
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(session({
    secret: 'cat is dead',
    cookie: { maxAge: 60000 }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ganesha',
    database: 'payroll',
    multivalue: true
});
connection.connect((err) => {
    if (!err)
        console.log("Database is connected!!");
    else
        console.log(`Database connection is failed : ` + JSON.stringify(err, undefined, 2));
});

app.use(function (req, res, next) {
    //res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.listen(port, function () {
    console.log("application running on port: " + port);
});


app.post('/admin', function (req, res) {

    var admin_id = 'Atharva';
    var admin_pass = '123';

    if (admin_id == req.body.admin_id & admin_pass == req.body.pass) {

        res.redirect('/admin-login')
    }
    // res.redirect('/admin-login')
})

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/admin', function (req, res) {
    res.render('admin');
});
app.get('/about', function (req, res) {
    res.render('about');
});
app.get('/admin-login', function (req, res) {
    res.render('admin-login');
});
app.get('/register', function (req, res) {
    res.render('register');
});
app.get('/salary-report', function (req, res) {
    res.render('salary-report', {
        // E_name :req.session.emp_name ,
        // E_mail:req.session.email ,
        // Date_of_join :req.session.dateofjoin =inputData.Date_of_join,
        // E_Dept:req.session.role 
    });
});
app.get('/admin-about', function (req, res) {
    res.render('admin-about');
});
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});
app.get('/empinfo', function (req, res) {
    res.render('empinfo')
});


app.post("/register", function (req, res, next) {
    inputData = {
        E_name: req.body.emp_name,
        gender: req.body.gender,
        E_DOB: req.body.dateofbirth,
        E_email: req.body.email,
        Date_of_join: req.body.dateofjoin,
        E_Dept: req.body.role,
        E_address: req.body.address,
        E_phno: req.body.phone,
        Password: req.body.password,
        Confirm_Pass: req.body.confirm_password,
    };

    // check 
    // INSERT QUERY
    var sql = "INSERT INTO registration SET ?";
    connection.query(sql, inputData, function (err, data) {
        if (err) throw err;
        else {

            req.session.emp_name = inputData.E_name,

                req.session.email = inputData.E_mail,
                req.session.dateofjoin = inputData.Date_of_join,
                req.session.role = inputData.E_Dept,

                res.redirect('/salary-report')
        }
    });


});

app.get('/showregi', function (req, res, next) {
    var sql = "SELECT * FROM registration ";
    connection.query(sql, function (err, data, fields) {
        if (err) throw err;

        else {
            res.send(data)
        }
    })

});

// DELETE QUERY
app.post('/delete', function (req, res) {

    var id = req.body.E_id;

    var sql = "DELETE FROM registration Where E_id =?";
    connection.query(sql, [req.body.E_id], function (err, data, fields) {
        if (err) throw err;
        else {
            console.log("deleted")
            res.redirect('/empinfo')
        }

    });
})

app.get('/upregi', function (req, res) {

    res.render('updateregi', {
        E_id: req.session.E_id,
        E_name: req.session.E_name,
        E_email: req.session.E_email,
        gender: req.session.gender,
        E_DOB: req.session.E_DOB,
        Date_of_join: req.session.Date_of_join,
        E_Dept: req.session.E_Dept,
        E_address: req.session.E_address,
        E_phno: req.session.E_phno,
        // password: req.session.password,
        // Confirm_Pass: req.session.Confirm_Pass
    });
})

app.post('/update', function (req, res) {
    var sql = "SELECT * FROM registration WHERE E_id =?";
    connection.query(sql, [req.body.E_id], function (err, data, fields) {
        if (err) throw err;
        //  console.log(data);

        req.session.E_id = data[0].E_id;
        req.session.E_name = data[0].E_name;
        req.session.E_email = data[0].E_email;
        req.session.gender = data[0].gender;
        req.session.E_DOB = data[0].E_DOB;
        req.session.Date_of_join = data[0].Date_of_join;
        req.session.E_Dept = data[0].E_Dept;
        req.session.E_address = data[0].E_address;
        req.session.E_phno = data[0].E_phno;
        req.session.password = data[0].password;
        req.session.Confirm_Pass = data[0].Confirm_Pass

        res.redirect('/upregi');

        // res.redirect('/edit' );
        // res.send(data);

    })

});


app.post('/updateemp', function (req, res) {

    inputData = {
        E_id: req.body.E_id,
        E_name: req.body.emp_name,
        gender: req.body.gender,
        E_DOB: req.body.dateofbirth,
        E_email: req.body.email,
        Date_of_join: req.body.dateofjoin,
        E_Dept: req.body.role,
        E_address: req.body.address,
        E_phno: req.body.phone,
        //   Password: req.body.password,
        //   Confirm_Pass: req.body.confirm_password,
    };
    //    Console.log(inputData); UPDATE QUERY
    var sql = "UPDATE registration SET E_name = ? , gender = ? , E_DOB = ? , E_email= ? ,Date_of_join = ? ,  E_Dept = ? , \
                    E_address= ? , E_phno = ?  WHERE E_id = ? " ;
    connection.query(sql, [inputData.E_name, inputData.gender, inputData.E_DOB, inputData.E_email, inputData.Date_of_join, inputData.E_Dept, inputData.E_address, inputData.E_phno, inputData.E_id], function (err, data, fields) {
        if (err) throw err;
        else {
            console.log("updated")
            res.redirect('/empinfo')
        }

    });
})


// emp display
app.get('/emppage', function (req, res) {
    res.render('emppage', {
        e_id: req.session.E_id,
        E_name: req.session.E_name,
        E_email: req.session.E_email,
        gender: req.session.gender,
        E_DOB: req.session.E_DOB,
        Date_of_join: req.session.Date_of_join,
        E_Dept: req.session.E_Dept,
        E_address: req.session.E_address,
        E_phno: req.session.E_phno,
    });
});

app.post('/index', function (req, res) {

    var sql = "SELECT * FROM registration Where E_email=?";
    connection.query(sql, [req.body.email], function (err, data) {
        if (err) throw err;
        else {
            req.session.E_id = data[0].E_id;
            req.session.E_name = data[0].E_name;
            req.session.E_email = data[0].E_email;
            req.session.gender = data[0].gender;
            req.session.E_DOB = data[0].E_DOB;
            req.session.Date_of_join = data[0].Date_of_join;
            req.session.E_Dept = data[0].E_Dept;
            req.session.E_address = data[0].E_address;
            req.session.E_phno = data[0].E_phno;

            res.redirect('/emppage');
        }
    });


})
app.get('/empsalaryinfo', function (req, res) {
    res.render('empsalaryinfo')
});

app.post("/salaryreport", function (req, res, next) {
    inputData = {
        E_name: req.body.E_name,
        E_email: req.body.E_email,
        dept_name: req.body.dept_name,
        E_joindate: req.body.E_joindate,
        salary: req.body.salary,
        bonus: req.body.bonus,
        Tax: req.body.Tax,

    };

    // check 

    var sql = "INSERT INTO Payment_Deduction SET ?";
    connection.query(sql, inputData, function (err, data) {
        if (err) throw err;
        else {
            res.redirect('/empsalaryinfo')
        }
    });

});

app.get('/showdeductiondata', function (req, res, next) {
    var sql = "SELECT * FROM Payment_Deduction ";
    connection.query(sql, function (err, data, fields) {
        if (err) throw err;

        else {
            res.send(data)
        }
    })

});