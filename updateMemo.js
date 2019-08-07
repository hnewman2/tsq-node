const db = require('./dbConnection');

function removeMemo(req, res) {
    updateMemo(req, res, false);
}

function showMemo(req, res) {
    let query = 'update tsq.PrintoutMemos set display = true where id=?;';

    db.query(query, req.body, (error, response) => {
        if (error) {
            console.log('ERROR:::::::::: \n' +
                error);
        }

        if (response && response.affectedRows > 0) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    });
    //  updateMemo(req, res, true);
}

function queryDb(body) {


    console.log(body);
    query = 'update tsq.PrintoutMemos set display = false where id=?;';

    return new Promise((resolve, reject) => {
        db.query(query, body, (error, response) => {
            if (error) {
                console.log('ERROR:::::::::: \n' +
                    error);
            }

            if (response && response.affectedRows > 0) {
                resolve(response);
            } else {
                reject(error || response);
            }
        });
    });;
}

function updateMemo(req, res) {


    let promises = [];


    console.log('req.body.memos: : : : : : : : : : : : : : : : : : : :\n' + req.body.memos);
    for (var i in req.body.memos) {
       
        body = req.body.memos[i];
        promises.push(queryDb(body));
    };

    Promise.all(promises).then(response => {

        console.log('response: ' + response[0].attributes);
        if (response.length == req.body.memos.length) {

            console.log('the lengths were thet same!');
            res.sendStatus(200);
        } else {
            console.log('the length of the response is: ' + response.length);
            console.log('the length of the memos is' + req.body.memos.length);
            res.sendStatus(500);
        }
    });


}


module.exports = { showMemo, removeMemo }