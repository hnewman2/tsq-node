const db = require('./dbConnection');

function logPickup(req,res){
    let query= 'INSERT INTO PickupLog (vol_ID, route_ID) VALUES (?,?);';
           
    db.query(query, [req.body.vol_ID, req.body.route_ID], (error, response)=>{
        if(error) { 
            console.log(error);  
        }
        if(response && response.affectedRows > 0){
            res.sendStatus(200);
        }
        else{
            res.sendStatus(500);
        }
    });
}

module.exports = logPickup