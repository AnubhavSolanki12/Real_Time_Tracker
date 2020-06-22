import { Component, ViewChild,ElementRef, OnInit } from '@angular/core';
import {AgmMap  } from '@agm/core';
import * as io from 'socket.io-client';
import {} from 'googlemaps';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
@ViewChild(AgmMap,{static: true}) public agmMap: AgmMap;
@ViewChild('track') trackButton: ElementRef;
@ViewChild('inputname') clientinput : ElementRef;
  lat;
  lng;
  zoom;   
  driverLat;
  driverLong;
  frames = 100;
  prevLocationLat;
  prevLocationLong;
  socket: SocketIOClient.Socket;
  deltaLat = 0 ;
  deltaLng = 0;
  clientNameInput : string;
  i:number =  0;
  delay: 0.01;
  clientIcon:string = "http://maps.google.com/mapfiles/kml/pal3/icon48.png";
  driverIcon:String = "http://maps.google.com/mapfiles/kml/pal2/icon39.png";
  

  get() {  
    if (navigator.geolocation) {  
        navigator.geolocation.getCurrentPosition((position: Position) => {  
            if (position) {  
                this.lat = position.coords.latitude;  
                this.lng = position.coords.longitude;  
            } 
        })  
    }
  }
  
  moveMarker(){
   {
      this.prevLocationLat = this.prevLocationLat + this.deltaLat;
      this.prevLocationLong =this.prevLocationLong + this.deltaLng;
      this.driverLat = this.prevLocationLat;
      this.driverLong = this.prevLocationLong;
      if(this.i <= 100){
        (this.i)++;
        setTimeout(()=>{this.moveMarker();},10);
      }
    }
    
  }

  animate(driverLocation){
    this.i=0;
    this.deltaLat = (driverLocation.lat - this.prevLocationLat)/100;
    this.deltaLng = (driverLocation.long - this.prevLocationLong)/100;
    this.moveMarker();
  }

  showMap(){
    let runOnce =true;
    let client_name = this.clientinput.nativeElement.value;
      if(client_name!=null)
      this.socket.emit("postClientName",client_name);
      this.socket.on("update-"+client_name,(driver)=>{
        if(runOnce){
          this.driverLat = driver.location.lat;
          this.driverLong = driver.location.long;
          runOnce = false;
          this.prevLocationLat = driver.location.lat;
          this.prevLocationLong = driver.location.long;
        }else{
          this.animate(driver.location);
        }
      });
    
  }

  constructor() {
    this.socket = io.connect('http://localhost:3000/');
  }  

  ngOnInit(): void {
    this.get()  
    this.agmMap.triggerResize(true);  
    this.zoom = 14;
  }
}
