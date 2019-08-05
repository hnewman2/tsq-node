const db = require('./dbConnection');
const pdf = require('html-pdf');
const email = require('./sendEmail');


function setUpPage(tableData, routeNum) {
   //generate the html for the pdf with the mapped data

   return (

      `<div>
         <h3>Route &nbsp; ${routeNum}</h3>

         <table>
            <thead>
               <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Family Size</th>
                  <th>Phone Number</th>
                  <th>Notes</th>
               </tr>
            </thead>
            <tbody>
               ${tableData}
            </tbody>
         </table>
      </div>`
   );
}



function createPDF(req, res) {
   var routeNum = req.body.route;
   //get the info
   let query = 'SELECT * FROM CurrentRoutesDetailView WHERE route_ID = ?';

   db.query(query, routeNum, (error, response) => {

      console.log(error || response);
      if (response && response.length > 0) {
         var tableData = response.map(row => {
            
            return(`<tr>
               <td>${row.fName} ${row.lName}</td>
               <td>${row.addressLine1}, &nbsp; ${row.addressLine2}</td>
               <td>${row.city}</td>
               <td>${row.familySize}</td>
               <td>${row.phone}</td>
               <td>
                  ${row.addressNotes} <br />
                  ${row.centerNotes} <br />
                  ${row.notes}
               </td>
            </tr>`);
         });

         const table = setUpPage(tableData, routeNum);
         const htmlPdf =
            ` <!doctype html>
          <html>
             <head>
                <meta charset="utf-8">
                <title>Tomchei Shabbos Deliveries</title>
                <style>
                </style> 
             </head>
             <body>
               ${table}
             </body>
          </html>`;

         const filePath= './temp/TSQDeliveryRoute'+routeNum+'.pdf';
         const fileName='TSQDeliveryRoute'+routeNum+'.pdf';

          pdf.create(htmlPdf, {}).toFile(filePath, (err) => {
            if(err) {
                console.log(err);
                res.sendStatus(500);
            }

            //send the email
            email.sendEmailWithAttachment(req, req, filePath, fileName);
          });
         
      }

   });
   

}

module.exports = createPDF;


/*
 ` <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>Tomchei Shabbos Deliveries</title>
          <style>
             .invoice-box {
             max-width: 800px;
             margin: auto;
             padding: 30px;
             border: 1px solid #eee;
             box-shadow: 0 0 10px rgba(0, 0, 0, .15);
             font-size: 16px;
             line-height: 24px;
             font-family: 'Helvetica Neue', 'Helvetica',
             color: #555;
             }
             .margin-top {
             margin-top: 50px;
             }
             .justify-center {
             text-align: center;
             }
             .invoice-box table {
             width: 100%;
             line-height: inherit;
             text-align: left;
             }
             .invoice-box table td {
             padding: 5px;
             vertical-align: top;
             }
             .invoice-box table tr td:nth-child(2) {
             text-align: right;
             }
             .invoice-box table tr.top table td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.top table td.title {
             font-size: 45px;
             line-height: 45px;
             color: #333;
             }
             .invoice-box table tr.information table td {
             padding-bottom: 40px;
             }
             .invoice-box table tr.heading td {
             background: #eee;
             border-bottom: 1px solid #ddd;
             font-weight: bold;
             }
             .invoice-box table tr.details td {
             padding-bottom: 20px;
             }
             .invoice-box table tr.item td {
             border-bottom: 1px solid #eee;
             }
             .invoice-box table tr.item.last td {
             border-bottom: none;
             }
             .invoice-box table tr.total td:nth-child(2) {
             border-top: 2px solid #eee;
             font-weight: bold;
             }
             @media only screen and (max-width: 600px) {
             .invoice-box table tr.top table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             .invoice-box table tr.information table td {
             width: 100%;
             display: block;
             text-align: center;
             }
             }
          </style>
       </head>
       <body>
          <div class="invoice-box">
             <table cellpadding="0" cellspacing="0">
                <tr class="top">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td class="title"><img  src="https://i2.wp.com/cleverlogos.co/wp-content/uploads/2018/05/reciepthound_1.jpg?fit=800%2C600&ssl=1"
                               style="width:100%; max-width:156px;"></td>
                            <td>
                               Datum: ${`${today.getDate()}. ${today.getMonth() + 1}. ${today.getFullYear()}.`}
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr class="information">
                   <td colspan="2">
                      <table>
                         <tr>
                            <td>
                               Customer name: ${name}
                            </td>
                            <td>
                               Receipt number: ${receiptId}
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr class="heading">
                   <td>Bought items:</td>
                   <td>Price</td>
                </tr>
                <tr class="item">
                   <td>First item:</td>
                   <td>${price1}$</td>
                </tr>
                <tr class="item">
                   <td>Second item:</td>
                   <td>${price2}$</td>
                </tr>
             </table>
             <br />
             <h1 class="justify-center">Total price: ${parseInt(price1) + parseInt(price2)}$</h1>
          </div>
       </body>
    </html>`

*/
