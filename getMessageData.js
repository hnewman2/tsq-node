const db = require('./dbConnection');


function getContactsNew(req, res){

    query = 'with p (phone, dateCreated, readStatus) \
    as(select if(FromPhone="2564877877",ToPhone,FromPhone) , \
                 dateCreated, ReadStatus from SmsInbox ),\
                 p2 (phone, dateCreated,readStatus) \
                 as(select phone, max(dateCreated), sum(readStatus)\
                 from p group by phone)\
                 select p2.phone, p2.dateCreated,readStatus, concat(firstName," " ,lastName)\
                 as name, primaryRouteId from p2 left join tsq.Volunteers as v \
                 on v.phone = p2.phone order by dateCreated desc;';

      db.query(query, (error, response) => {
          if (error) {
              console.log(error.sqlMessage);
              res.sendStatus(500);
          }
          else {
           //   console.log(response);
              res.status(200);
              res.json(response);
          }
      });
}
function updateReadStatus(req,res){
    query= 'update SmsInbox set ReadStatus=0 where if(ToPhone=\'2564877877\', FromPhone,ToPhone)= ?;';
    db.query(query, req.body, (error, response) => {
        if (error) {
            //console.log(error);
            res.sendStatus(500);
        }
        else {
           // console.log(query);
            res.status(200);
        res.end();
        }
    });
}

function loadInbox(req,res){
query = 'SELECT * FROM tsq.SmsInbox\
        where if(ToPhone=\'2564877877\', FromPhone,ToPhone)= ?;';
       

    db.query(query, req.body, (error, response) => {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        }
        else {
           // console.log(query);
            res.status(200);
            res.json(response);
        }
    });
}

module.exports = {getContactsNew, loadInbox, updateReadStatus}