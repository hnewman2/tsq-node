const db = require('./dbConnection');

function updateVolInfo(req, res) {

    let query = 'Update Volunteers SET '+req.body.key[0]+'=? where vol_ID =?;';
    /*console.log(req.body.key[0]);
    console.log(req.body.value);
    console.log(req.body.id);*/

    db.query(query, [req.body.value, req.body.id],
         (error, response) => {
        console.log(error || response);

        if (response && response.length > 0) {
            res.status(200);
            res.json(response);
        }
        else if (response) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(500);
        }
    });


}
module.exports = updateVolInfo