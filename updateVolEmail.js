const db = require('./dbConnection');

function updateVolEmail(req, res){
        
    let query = 'UPDATE Volunteers SET email = ? where vol_ID  = ?';       
    
    db.query(query, [req.body.email, req.body.vol_ID], (error,response) => {
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


module.exports = updateVolEmail;