
const db = require('./dbConnection');

function removeMemo(req, res) {
    updateMemo(req, res, false);
}
function showMemo(req, res) {
    updateMemo(req, res, true);
}

function updateMemo(req, res, status) {

    query = 'update tsq.PrintoutMemos set display = ' + status + ' where id=?;';

    db.query(query, req.body, (error, response) => {
        if (error) { console.log(error); }

        if (response && response.affectedRows >0) {
            res.status(200);
            res.json(response);
        }
        else {
            res.sendStatus(500);
        }
    });
}


module.exports = { showMemo, removeMemo }