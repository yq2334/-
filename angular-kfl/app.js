var express = require("express");
var mysql = require("mysql");
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nibuzhidaode233..",
    database: "kfl",
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

app.post("/getOrder", (req, res) => {
    var order = req.body;
    // console.log(order);
    var sqlStr = "INSERT INTO kf_order(oid, phone, user_name, sex, addr, did) VALUES ";
    var orderSql = "(" + order.oid + ", '" + order.phone + "', '" + order.user_name + "',' "
        + order.sex + "',' " + order.addr + "', " + order.did + ");";
    var _sql = sqlStr + orderSql;
    // console.log(_sql);
    connection.query(_sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

app.get('/getMyOrder', (req, res) => {
    var sqlStr = "select * from kf_order";
    connection.query(sqlStr, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

app.listen(3000);