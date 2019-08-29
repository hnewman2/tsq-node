const uploadForm = require('./uploadData.js');
//const port = 3001;

const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();

const cookieParser = require('cookie-parser');
const path = require('path');
const sessionManager = require('./login.js');
const hostname = '192.168.9.114';
const search = require('./volSearch');
const history = require('./history.js');
const volunteers = require('./volunteers');
const getVolunteerTypes = require('./getVolunteerTypes');
const editVol = require('./editVol');
const getRouteInformation = require('./getRouteInformation');
const logPickup = require('./logPickup');
const addNewVolunteer = require('./addNewVolunteer');
const getData = require('./getData');
const sendText = require('./sendMassText');
const email = require('./sendEmail');
const updateVolStatus = require('./updateVolStatus');
const autoReply = require('./autoReply');
const bodyParser = require('body-parser');
const updateInbox = require('./importInbox');
const getMessageData = require('./getMessageData');
const messageStatus = require('./messageStatus');
const unreadCount = require('./unreadCount');
const getAllRouteInfo = require('./getAllRoutesInfo');
const addMemo = require('./addMemo');
const updateMemo = require('./updateMemo');
const getTodaysMemos = require('./getTodaysMemos');
const createPdf = require('./generatePDF');
const updateVolEmail = require('./updateVolEmail');
const currVolTypes = require('./getCurrVolTypes');
const getRecipientData = require('./getRecipientData');
const updateVolInfo = require('./updateVolInfo');
const updateEmailConfig = require('./updateEmailConfig');
const updateVolState= require('./updateVolState');

app.use(cookieParser());
app.use(bodyParser.text());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer()); // for parsing multipart/form-data

app.use(express.static("../tsq-react/build"));



app.post('/FormUpload', (req, res) => {
    uploadForm(req, res);
});

app.post('/getAllVol', (req, res) => {
    getData(req, res, 'select vol_ID, firstName,lastName,Volunteers.address,\
    Volunteers.city, abbr,Volunteers.zip,phone, sendSMS, Volunteers.email,sendEmail,isActive,\
    primaryRouteID, Shuls.name from\
     (Volunteers left outer join States on Volunteers.state= States.state_ID)\
     left outer join Shuls on Volunteers.shul_ID=Shuls.shul_ID');
});
app.post('/resetPassword', (req, res) => {
    sessionManager.login(req, res);
});

app.post('/login', (req, res) => {
    sessionManager.login(req, res);
});

app.post('/logoutAdmin', (req, res) => {
    sessionManager.AdminLogout(req, res);
});

app.post('/logoutUser', (req, res) => {
    sessionManager.UserLogout(req, res);
});

app.post('/authorizeAdmin', (req, res) => {
    sessionManager.authorizeAdmin(req, res);
});

app.post('/authorizeUser', (req, res) => {
    sessionManager.authorizeUser(req, res);
});

app.post('/searchPhone', (req, res) => {
    search.phoneSearch(req, res);
});

app.post('/searchEmail', (req, res) => {
    search.emailSearch(req, res);
});

app.post('/routeHistoryByDate', (req, res) => {
    history.filterByDate(req, res);
});

app.post('/routeHistoryByRoute', (req, res) => {
    history.filterByRoute(req, res);
});

app.post('/routeHistoryByVol', (req, res) => {
    history.filterByVol(req, res);
});

app.post('/routeHistory', (req, res) => {
    history.unfiltered(req, res);
});

app.post('/getRoutes', (req, res) => {
    getData(req, res, 'select route_ID from currentRoutesView where route_ID != -1 ;');
});

app.post('/getVolunteersDEV', (req, res) => {
    volunteers.developers(req, res);
});

app.post('/addMemo', (req, res) => {
    addMemo(req, res);
});
app.post('/updateMemo', (req, res) => {
    updateMemo.showMemo(req, res);
});
app.post('/removeMemo', (req, res) => {
    updateMemo.removeMemo(req, res);
});
app.post('/getVolunteersFilterByVolType', (req, res) => {
    volunteers.filterByVolType(req, res);
});

app.post('/getVolunteersFilterByVolName', (req, res) => {
    volunteers.filterByVolName(req, res);
});

app.post('/getVolunteersFilterByRoute', (req, res) => {
    volunteers.filterByRoute(req, res);
});

app.post('/getVolunteersAndRecipients', (req, res) => {
    volunteers.allVolAndRecipients(req, res);
});

app.post('/getVolunteers', (req, res) => {
    volunteers.unfiltered(req, res);
});

app.post('/getVolunteerTypes', (req, res) => {
    getVolunteerTypes(req, res);
});

app.post('/getRouteInformation', (req, res) => {
    getRouteInformation(req, res);
});
app.post('/getAllRouteInfo', (req, res) => {
    getAllRouteInfo(req, res);
});
app.post('/getTodaysMemos', (req, res) => {
    getTodaysMemos(req, res);
});
app.post('/processedRoutes', (req, res) => {
    getData(req, res, '  select route_ID, activityTime, concat(lastName,\', \',firstName ) as name, phone from PickupLog\
    inner join Volunteers on\
    PickupLog.vol_ID = Volunteers.vol_ID\
   where Date(activityTime) >= curdate();');
});

app.post('/outstandingRoutes', (req, res) => {
    getData(req, res, 'select route_ID from currentRoutesView\
        where not exists( select route_ID from PickupLog where\
        Date(activityTime) >= curdate()\
        and currentRoutesView.route_ID = PickupLog.route_ID);');
});

app.post('/logPickup', (req, res) => {
    logPickup(req, res);
});

app.post('/addNewVolunteer', (req, res) => {
    addNewVolunteer(req, res);
});

app.post('/getStates', (req, res) => {
    getData(req, res, 'SELECT state_ID, abbr FROM States;');
});

app.post('/getShuls', (req, res) => {
    getData(req, res, 'SELECT shul_ID, name FROM Shuls;');
});

app.post('/editVol', (req, res) => {
    editVol(req, res);
});
app.post('/massUpdateVolInfo', (req, res) => {
    updateVolInfo(req, res);
});
app.post('/updateVolState',(req,res)=>{
    updateVolState(req,res);
});

app.post('/sendText', (req, res) => {
    sendText(req, res);
});

app.post('/sendEmail', (req, res) => {
    email(req, res);
});

app.post('/updateVolStatusActive', (req, res) => {
    updateVolStatus.volStatusActive(req, res);
});

app.post('/updateVolStatusInactive', (req, res) => {
    updateVolStatus.volStatusInactive(req, res);
});

app.post('/autoReply', (req, res) => {
    autoReply.autoReply(req, res, app);

});

/*app.post('/inbox', (req, res) => {
    inbox(req, res);
});*/

app.post('/getContactsNew', (req, res) => {
    getMessageData.getContactsNew(req, res);
});
/*app.post('/getContacts', (req, res) => {
    getContacts(req, res);
});*/
app.post('/updateInbox', (req, res) => {
    updateInbox.updateAll(req, res);

});
app.post('/addSent', (req, res) => {
    updateInbox.addSent(req, res);

});
app.post('/updateReadStatus', (req, res) => {
    getMessageData.updateReadStatus(req, res);
});
app.post('/unreadCount', (req, res) => {
    unreadCount(req, res);
});
app.post('/getMemos', (req, res) => {
    getData(req, res, 'Select * From PrintoutMemos');
});
app.get('/messageStatus', (req, res) => {
    messageStatus.initialiseStatusSSE(req, res, app);
});
app.get('/newMessage', (req, res) => {
    autoReply.initialiseSSE(req, res, app);
});
app.post('/loadInbox', (req, res) => {
    getMessageData.loadInbox(req, res);
});
app.post('/updateMessageStatus', (req, res) => {
    messageStatus.messageStatus(req, res, app);
});

app.post('/VolNameSearch', (req, res) => {
    getData(req, res, 'SELECT concat(lastName,\', \',firstName)as volunteer, phone, vol_ID FROM tsq.Volunteers WHERE isActive order by lastName, firstName ;');
});

app.post('/getCurrVolunteerTypes', (req, res) => {
    currVolTypes(req, res);
});

app.post('/getRecipientInfo', (req, res) => {
    getRecipientData.thisRecipient(req, res);
});

app.post('/getRecipients', (req, res) => {
    getRecipientData.allRecipients(req, res);
});

app.post('/create-pdf', (req, res) => {
    createPdf(req, res);
});

app.post('/updateVolEmail', (req, res) => {
    updateVolEmail(req, res);
});

app.post('/getCurrEmailConfig', (req, res) => {
    getData(req, res, 'SELECT * FROM EmailConfig;');
});

app.post('/updateEmailConfig', (req, res) => {
    updateEmailConfig(req, res);
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../tsq-react/build/index.html'),
        err => {
            if (err) {
                res.status(500).send(err)
            }
        });
});


let options = {
    key: fs.readFileSync('../tsq/ssl/server.key'),
    cert: fs.readFileSync('../tsq/ssl/server.crt')
};

http.createServer(app).listen(3001);
https.createServer(options, app).listen(3002);
/*
app.listen(port, hostname, function() {
    console.log('Server running at http://' + hostname + ':' + port + '/');
});*/