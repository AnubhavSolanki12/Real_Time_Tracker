# Real_Time_Tracker
In this application their are two frontend one is created in angular and other is in javascript.The one which is in angular is controlled by client and other one is controlled by respective driver, the database which is used in this program is MongoDB and the backend is programmed in NodeJs.

# Technology Used : 
- Sockets
- Angular9(Client Side Frontend)
- Nodejs(Backend)
- MongoDB(Database)
- JavaScript(Driver Side Frontend)
- BootStrap(Styling)
- Express


# Installation : 

- Commands Need to be executed before running the code are in required.txt and should be executed inside FrontEnd Folder.

- For backend just go to the Backend folder and in cmd type `npm install`

- Please change the MongoDB URI(in server.js inside Backend) and the api key of google map(in frontend appmodule.ts and appcomponent.html)

- Please make required changes in MongoDB database as given in screenshot.

# Run the Code :

- First of all, go to the FrontEnd folder and open cmd and type `ng serve`.
- Then, after that go to the Backend folder and open cmd and type `npm start`
- Then,in http://localhost:4200 their will be frontend handled by client and in http://localhost:3000/ their will be the frontend handled by driver.
- Then on client side enter the name of client then submit client name and on driver side enter the name of driver and submit the driver name.(Assuming the MongoDB is initialized as shown in screenshot).
- Then on client side you can see the driver moving.(Note: as driver's location is random so please zoom out the map to locate the driver).


