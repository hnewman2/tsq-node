const db = require('./dbConnection');

function updateVolunteerStatus(req, res, status){

    var id;

    if(req.body.includes('@')) {
        id = 'email';
    } else {
        id = 'phone';
    }
        
    let query = 'UPDATE Volunteers SET isActive ='+ status + ' where ' + id + ' = ?';       
    
    db.query(query, req.body, (error,response) => {
        if(error) { 
            console.log(error);  
        }
        if(response && response.affectedRows>0){
            res.status(200);
            res.json(response);
        }
        else if(response){
            res.status(204);
            res.json(response);
        }
        else{
            res.sendStatus(500);
        }
    });
}

function volStatusActive(req, res) {
    updateVolunteerStatus(req, res, true)
}

function volStatusInactive(req, res) {
    updateVolunteerStatus(req, res, false);
}

module.exports = {volStatusInactive, volStatusActive}