function messageStatus(req, res, app) {

    let status = req.body.SmsStatus
    console.log(status);

    if (status === 'delivered') {


        app.emit('status', {
            title: 'message sent!',
            status,
            timestamp: new Date()
        });
        res.status(200);
        res.end();
    }
}


function initialiseStatusSSE(req, res, app) {

    let handleMessage = data => {
        res.write(`event: status\n`);
        res.write(`data:${data}\n\n`);
    }
    res.on('close', function() {
        app.removeListener('status', handleMessage);
    });

    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
    });

    app.on('status', handleMessage);

}
module.exports = { messageStatus, initialiseStatusSSE };