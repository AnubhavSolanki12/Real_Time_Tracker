//JAVASCRIPT FOR THE DRIVER SIDE 

//SOCKET 
const socket = io({ transports: ['websocket']});

//SUBMIT EVENT LISTENER
document.getElementById('submit').addEventListener("click",()=>{
  var driver_name = document.getElementById('driverName').value;  //DRIVER NAME
  if(driver_name){
    document.getElementById("done").style.display = "inline-block";
    var longlats = [78.161166,30.187217]
    const socket = io({ transports: ['websocket'] });

    setInterval(function() {                                        //FUNCTION WILL RUN IN EVERY 5 SEC
        var item = {};
        item.Coordinate = {};
        item.Coordinate.Longitude = longlats[0] + (Math.random()/100);  //RANDOM LANGITUDE
        item.Coordinate.Latitude = longlats[1] + (Math.random()/100); //RANDOM LATITUDE
        item.name = driver_name;
        socket.emit('lastKnownLocation', item);                     //SOCKET EMITTING THE LOCATION
    }, 5000);
  }
});


