const fs = require('fs');
const db = require('./dbConnection');
const csv = require('fast-csv');
const formidable = require('formidable');

//upload form
function uploadForm(req, res) {
	console.log('in uploadForm');
	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		if (err) {
			console.log(err);
		}
		let oldpath = files.fileImport.path;
		let newpath = 'temp/' + files.fileImport.name;
		fs.rename(oldpath, newpath, (err) => {
			if (err) {
				throw err;
			}
			parse(newpath, res);
		});
	});
}

module.exports = uploadForm;

//parse the csv
function parse(filePath, res) {
	let stream = fs.createReadStream(filePath);
	let myData = [];
	let csvStream = csv
		.parse()
		.on("data", function (data) {
			myData.push(data);
		})
		.on("end", function () {
			myData.shift();

			//insert the data into a temp table
			let deleteQuery = 'DROP TABLE  IF EXISTS tempRoutes;';
			db.query(deleteQuery, (error, response) => {
				console.log("dropping table tempRoutes: \n_________________ \n\
				"+error||response)
				if (error) {
					//console.log(error);
					res.sendStatus(500);
				}
				else {
					let query = 'CREATE TABLE tempRoutes( route_ID int, routeType int not null, familySize int, fname tinytext, lname tinytext,\
						address1 tinytext, address2 tinytext, city varchar(55), email varchar(75), phone1 varchar(25), phone2 varchar(25), \
						addressNotes text, centerNote text, notes text, week varchar(10));';
					db.query(query, (error, response) => {
						console.log("recreating tempRoutes with new data:\n\
						____________________________\
						\n  "+error||response);
						if (error) {
							
							res.sendStatus(500);
						}
						else {
							/* 
							Export Query:
							SELECT  Route.RouteDesc AS RouteID, RouteType, [Adult]+[Children] AS FamilySize, Recipients.FName, Recipients.LName, 
							Recipients.AddrSt, Recipients.AddrApt, Recipients.City, Recipients.Email, Recipients.Phone1, Recipients.AddrNotes, 
							Recipients.CenterNote, Recipients.Notes, Recipients.Week
							FROM Recipients INNER JOIN Route ON Recipients.RouteID = Route.RouteID
							WHERE Recipients.recStatus = "yes"
							*/

							query = 'INSERT INTO tempRoutes (route_ID, routeType, familySize, fname, lname, address1, address2, city, email, phone1, phone2, addressNotes,\
								centerNote, notes, week) VALUES ?';

							db.query(query, [myData], (error, response) => {
								if (error) {
									console.log(error);
									res.sendStatus(500);
								}
								else {
									//call procedure to deal with the data and put it in the routes and routesdetail table,
									// the procedure will also convert the access string of the date to the sql date version
									query = 'call updateRoutesFromTemp'
									db.query(query, (error, response) => {
										if (error) { console.log(error); }
										if (response) {
											res.sendStatus(200); //first see if the parse and the query was successful and then return the appropriate response
										} else {
											res.sendStatus(500);
										}
									});
								}
							});
						}

					});
				}
			});

		});

	stream.pipe(csvStream);

}