const db = require('./dbConnection');

function phoneSearch(req, res) {
    let query = 'SELECT * FROM Volunteers WHERE phone= ?;';
    search(req, res, query);
}

function emailSearch(req, res) {
    let query = 'SELECT * FROM Volunteers WHERE email= ?;';
    search(req, res, query);
}

function search(req, res, query) {
    db.query(query, req.body, (error, response) => {
        if (error) { console.log(error); }

        if (response && response.length > 0) {
            res.status(200);
            res.json(response);
        }
        else {
            res.sendStatus(401);
        }
    });
}

module.exports = { phoneSearch, emailSearch }
