const db = require('./dbConnection');

function removeMemo(req, res) {
    updateMemo(req, res, false);
}

function showMemo(req, res) {
    updateMemo(req, res, true);
}

function queryDb(query, body) {
    db.query(query, body, (error, response) => {
        if (error) {
            console.log('ERROR:::::::::: \n' +
                error);
        }

        if (response && response.affectedRows > 0) {
            return 1;
            /*  res.status(200);
              res.json(response);*/
        } else {
            return 0;
            /* res.sendStatus(500);*/
        }
    });
}

function updateMemo(req, res, status) {
    let count = 0;
    console.log(req.body);
    query = 'update tsq.PrintoutMemos set display = ' + status + ' where id=?;';

    for (var i in req.body.memos) {
        count += queryDb(query, req.body.memos[i]);
    };


    if (count == req.body.memos.length) {
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
    console.log(allIds);
    //console.log(allIds);


}


module.exports = { showMemo, removeMemo }