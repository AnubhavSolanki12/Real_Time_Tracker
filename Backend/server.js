var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
const {MongoClient} = require('mongodb');
var database;
var count=0;
var DatabaseName = 'DetailsForLiveTracker';
var collectionName = 'DriverDetails';

(async function main(){
    const uri = 'YOUR MONGO URI';
    const client = new MongoClient(uri,{
        useUnifiedTopology: true
    });
    
    try {
        await client.connect((err,db)=>{
            if(err) throw err;
            console.log('Database Loaded');
            database = db;
            //addData(db,'anubhav','mike');
        });
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
})();

function addData(db,clientName,driverName){
    var dbo = db.db(DatabaseName);
    var myobj = {
        name : driverName,
        Client_Name : clientName,
        location : {
            lat : null,
            long : null
        },
    };
    myobj.name = ((myobj.name).trim()).toLowerCase();
    myobj.Client_Name = ((myobj.Client_Name).trim()).toLowerCase();
    dbo.collection(collectionName).insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
}

function updateData(myquery,newvalues){
    var dbo = database.db(DatabaseName);
    dbo.collection(collectionName).updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
    });
}

async function updateLocation(driver,clientName){
    var dbo = database.db(DatabaseName);
    await dbo.collection(collectionName).find({ }).forEach((data)=> { 
        if(data.name == driver.name){
            clientName.name = data.Client_Name;
            var driverlocation = {
                lat : driver.location.lat,
                long : driver.location.long
            }
            var myquery = { name: driver.name };
            var newvalues = { $set: {location : driverlocation} };
            updateData(myquery,newvalues);
        }
    }); 
}

async function getLocation(clientName,driver){
    var dbo = database.db(DatabaseName);
    if(driver.location!=null)
    await dbo.collection(collectionName).find({ }).forEach((data)=> { 
        if(data.Client_Name == clientName){
            driver.location.lat = data.location.lat;
            driver.location.long = data.location.long;
        }
    });
}


// Start the Server
http.listen(port, function () {
    console.log('Server Started. Listening on http://localhost:' + port);
});


// Express Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Render Main HTML file

app.get('/', function (req, res) {
    res.sendFile('views/publisher.html', {
        root: __dirname
    });
});

io.on('connection', function (socket) {
    console.log('No. of sockets ' + ++count);
    socket.on('disconnect', function() {
      --count;
      console.log('One person disconnected!');
      console.log('Now, no. of sockets : ' + count);
   });

   socket.on("postClientName",(clientName)=>{
        var driver = {
            location : {
                long: 123,
                lat : 456
            }
        };
        getLocation(clientName,driver).then(()=>{
            if(driver.location!=null){
                io.emit('update-' + clientName,driver); 
            }
        })
   })

   socket.on('lastKnownLocation',function (data) {
        var client = {
            name : 'xyz'
        };
        
        if(data!=null){
            var driver = {
                name : data.name,
                location : {
                    long: data.Coordinate.Longitude,
                    lat : data.Coordinate.Latitude
                }
            }; 
            updateLocation(driver,client).then(()=>{
                io.emit('update-' + client.name, driver);
            }); 
        }   
    });

});
