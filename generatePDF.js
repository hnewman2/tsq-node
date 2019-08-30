const db = require('./dbConnection');
const pdf = require('html-pdf');
const email = require('./sendEmail');


function setUpPage(tableData, routeNum) {
    //generate the html for the pdf with the mapped data

    return (

        `<div>
         <h3>Route &nbsp; ${routeNum}</h3>

         <table class='route-table'>
            <thead>
               <tr class='route-table-header-row'>
                  <th class='route-table-size'>Ppl</th>
                  <th class='route-table-name'>Name</th>
                  <th class='route-table-address'>Address</th>
                  <th class='route-table-city'>City</th>
                  <th class='route-table-phone'>Phone Number</th>
                  <th class='route-table-notes'>Notes</th>
               </tr>
            </thead>
            <tbody>
               ${tableData}
            </tbody>
         </table>
      </div>`
    );
}


function getPhone(phone) {
    var areaCode, three, four, newPhone;

    switch (phone.length) {
        case 7:
            areaCode = '718';
            three = phone.substring(0, 3);
            four = phone.substring(3, 7);
            break;
        case 8:
            areaCode = '718';
            three = phone.substring(0, 3);
            four = phone.substring(4, 8);
            break;
        case 10:
            areaCode = phone.substring(0, 3);
            three = phone.substring(3, 6);
            four = phone.substring(6, 11);
            break;
        case 12:
            areaCode = phone.substring(0, 3);
            three = phone.substring(4, 7);
            four = phone.substring(8, 12);
            break;
        case 0:
            return phone;
        default:
            return phone;
    }
    newPhone = '(' + areaCode + ') ' + three + '-' + four;
    return newPhone;
}

function createPDF(req, res) {


    var memoList = req.body.memos.map(m => `<p class='memos'>${m.body}</p>`);
    var routeNum = req.body.route;
    //get the info
    let query = 'SELECT * FROM CurrentRoutesDetailView WHERE route_ID = ? ORDER BY familySize desc;';

    db.query(query, routeNum, (error, response) => {

                console.log(error || response);
                if (response && response.length > 0) {
                    var tableData = response.map(row => {


                                return (`<tr>
                <td class='route-table-size'>${row.familySize}</td>
                <td class='route-table-name'>${row.lName}, ${row.fName}</td>
                <td class='route-table-address'>${row.addressLine1}, &nbsp; ${row.addressLine2}</td>
                <td class='route-table-city'>${row.city}</td>
                <td class='route-table-phone'>${getPhone(row.phone)}</td>
                <td class='uppercase route-table-notes'>
                ${row.addressNotes ? `<p>${row.addressNotes}</p>` : ``}
                ${row.centerNotes ? `<p>${row.centerNotes}</p>` : ``}
                ${row.notes ? `<p>${row.notes}</p>` : ``}
                </td>
             </tr>`
             );
            }).join('');

            const table = setUpPage(tableData, routeNum);
            const htmlPdf =
                ` <!doctype html>
           <html>
              <head>
                 <meta charset="utf-8">
                 <title>Tomchei Shabbos Deliveries</title>
                 <style>

                 .route-table {
                  margin-bottom: 20px;
                  width: 100%;
              }
              
              .route-table th,
              .route-table td {
                  margin-bottom: 2vh;
                  border-right: 1px dashed #ddd;
                  padding: .5% .5%;
              }
              
              .route-table td {
                  border-bottom: 10px solid #ddd;
                  font-size: 12px;
                  padding-top: 12px;
                  padding-bottom: 16px;
              }
              
              .route-table p {
                  margin-bottom: 3px;
              }
              
              
              .route-table-header-row {
                  font-size: 12px;
                  background-color: lightgray;
              }
              
              .route-table-size {
                  width: 4%;
                  text-align: center;
              }
              
              .route-table-name {
                  width: 18%;
                  text-transform: capitalize;
              }
              
              .route-table-address {
                  width: 22%;
                  text-transform: capitalize;
              }
              
              .route-table-city {
                  width: 14%;
                  text-transform: capitalize;
              }
              .route-table-phone {
                  width: 12%;
                  text-align: center;
              }
              
              .route-table-notes {
                  width: 30%;
              }
              
              .memos {
                  width: 100%;
                  text-align: center;
                  border: 1px dashed #a9a9a9;
                  margin-left: 2%;
                  margin-right: 2%;
                  width: 96%;
                  min-height: 15px;
              }
              
              .thick-bottom-border {
                  background-color: darkgray;
                  color: white;
              }
              
              .uppercase {
                  text-transform: uppercase;
              }
              
              .contact-info-string {
                  text-align: center;
                  width: 90%;
                  margin-left: 5%;
                  margin-right: 5%;
                  bottom: 0px;
                  vertical-align: bottom;
                  margin-bottom: 5px;
              }
              
              .contact-info-string a {
                  font-weight: bold;
              }
              
              .route-table thead tr {
                  border-bottom: solid 3px darkgray;
              }
              body {
               
               font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
               -webkit-font-smoothing: antialiased;
               -moz-osx-font-smoothing: grayscale;
               font-size: 12px;
               margin: 15px;
           }
              
                 </style> 
              </head>
              <body>
                ${table}
                ${memoList}
                <p class='contact-info-string' >
                    <a> WHOSE TURN IS IT NEXT TIME? </a>
                    <br />
                    Please ask for your alternate's number in case you need to switch.
                    <br />
                    <a>Changes? </a>
                    Call (718) 850-8070.
                    <a> Anything Irregular? </a>
                    Let us know at info@tsqinc.org.
                 </p>
              </body>
           </html>`;


            const filePath = './temp/TSQDeliveryRoute' + routeNum + '.pdf';
            const fileName = 'TSQDeliveryRoute' + routeNum + '.pdf';

            pdf.create(htmlPdf, {}).toFile(filePath, (err) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                }

                //send the email
                email(req, res, filePath, fileName);
            });

        }

    });


}

module.exports = createPDF;