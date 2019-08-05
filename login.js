const db = require('./dbConnection');
const adminSessions = [];
const userSessions = [];



function login(req, res) {

    //the below line should set the time zone for all node calls for a Date to EST.
    //process.env.TZ = 'America/Atikokan'

    //var today = new Date();
    //var todayString = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    var query = 'select password from Logins where userName = ?';
    var password;


    db.query(query, req.body.userName, (error, response) => {
        if (error) { console.log(error); }

        if (response) {
            password = response[0].password;
            console.log('sqlpassword: ' + password);
            console.log('yourpass: ' + req.body.password);
            if (req.body.password == password) {
                console.log('password matches');
                if (req.body.admin) {
                    loginAdmin(res);
                } else {
                    loginUser(res);
                }

            } else {
                console.log('password doesnt match');
                res.sendStatus(401);
            }
        }
        else {
            res.sendStatus(500);
        }
    });

}

function loginUser(res) {
    var sessionID = Date.now() + "" + Math.random();
    userSessions.push(sessionID);
    res.cookie('authCookie', sessionID, { maxAge: 18000000 });
    res.sendStatus(200);
}

function loginAdmin(res) {
    var sessionID = Date.now() + "" + Math.random();
    adminSessions.push(sessionID);
    res.cookie('adminAuthCookie', sessionID, { maxAge: 18000000 });
    //also log into user access
    userSessions.push(sessionID);
    res.cookie('authCookie', sessionID, { maxAge: 18000000 })
    res.sendStatus(200);
}

function authorizeAdmin(req, res) {
    var cookieValue = req.cookies.adminAuthCookie;

    if (cookieValue && adminSessions.includes(cookieValue)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
}

function authorizeUser(req, res) {
    var cookieValue = req.cookies.authCookie;
    if (cookieValue && userSessions.includes(cookieValue) > -1) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
}

function AdminLogout(req, res) {
    adminSessions.splice(adminSessions.indexOf(req.cookies.adminAuthCookie), 1);
    res.clearCookie('adminAuthCookie');
    UserLogout(req, res);

}

function UserLogout(req, res) {
    userSessions.splice(userSessions.indexOf(req.cookies.authCookie), 1);
    res.clearCookie('authCookie');
    res.sendStatus(200);
}

module.exports = { login, authorizeAdmin, authorizeUser, AdminLogout, UserLogout };