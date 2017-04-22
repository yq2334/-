var express = require("express");
var mysql = require("mysql");
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "kaifanla",
    // port:"3305"  //端口默认3306
});

connection.connect();

var app = express();

app.use(express.static("kfl"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/getDishes", (req, res) => {
    var req = req.query;
    var num = req.num;
    var index = req.index;
    var searchTxt = req.searchTxt;
    var sqlStr = '';

    if (searchTxt === '') {
        sqlStr = "select * from kf_dish limit " + index * num + "," + num;
    }else {
        sqlStr = "select * from kf_dish where name like '%" + searchTxt + "%' or material like '%" + searchTxt + "%'";
    }

    // console.log(sqlStr)
    connection.query(sqlStr, (err,result) => {
        if ( err ) throw err;
        res.send(result);
    })
    // console.log(num, index)
});

app.get("/getDish", (req, res) => {
    var req = req.query;
    var did = req.did;
    var sqlStr = "select * from kf_dish where did = " + did + "";

    connection.query(sqlStr, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

app.get("/getOrder", (req, res) => {
    var order = req.query;
    console.log(order);
    var dish={
        phone:order.phone,
        user_name:order.user_name,
        sex:order.sex,
        addr:order.addr,
        did:order.did
    }
    connection.query("INSERT INTO kf_order set ?",dish,function (err,result) {
        if(err) throw err;
        console.log(result)
        res.send(result)
    })
    // var sqlStr = "INSERT INTO kf_order(oid, phone, user_name, sex, addr, did) VALUES ";
    // var orderSql = "(" + order.oid + ", '" + order.phone + "', '" + order.user_name + "',' "
    //     + order.sex + "',' " + order.addr + "', " + order.did + ");";
    // var _sql = sqlStr + orderSql;
    // // console.log(_sql);
    // connection.query(_sql, (err, result) => {
    //     if (err) throw err;
    //     res.send(result);
    // })
});

app.get('/getMyOrder', function (req,res) {
    var phone=req.query.phone;
    var sql="SELECT * FROM kf_order inner join kf_dish on kf_order.did=kf_dish.did where phone='"+phone+"'";
    connection.query(sql,function (err,result) {
        if(err) throw err;
        res.json(result)
    })
    }
);

app.listen(3000);