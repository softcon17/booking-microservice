//////////////////////////////////////////////////////////////////
// This file contains the api endpoints that data is sent to.   //
// It takes the content you sent each endpoint via the req      //
// variable, and returns a response back to the client via res. //
//////////////////////////////////////////////////////////////////
'use strict';

// Wrapper to allow endpoints to be included
module.exports = function (app, db) {

  // Example of a get request, where we do some sql and retun the results
  app.get('/api/v1/booking', function (req, res) {
    // If you want to see the whole request object, you can take a look here
    // console.log(req);
    db.selectQuery("SELECT * FROM bookings;", null, function (err, results) {
      if (err) {
        // Report back if there were issues running the select
        // Why not look at res.status, and return user santitised messages depending on the error code
        res.status(500).json(err);
      } else {
        //Otherwise send confirmation back and create a variable called returnObject to send that data back in 
        let returnObject = [];
        // What we need to do now is loop through each row that has returned, and build our JSON reponce object
        // You can see here we have started it off by looping through each row, and logging its content
        results.forEach(function(sqlRow) {
            //console.log(sqlRow);
            // We need to build an object here that matches that of the return payload as specified 
            // in the XXX README XXX. If you look in the terinal output, you can see the format of the 
            // object returned from the database
            var objectToPush = {
              // You need to put code here
              // EG id : sqlRow.id,
            };
            // Here we take that translated row object, and add it to our list of data to send back
            returnObject.push(objectToPush)

        });
        //And finally we send that data back as a responce to the browser
        res.status(200).json(returnObject);
      }
    });
  });

  // Example of a post request, where we get some data from the request body
  // See that as the method is different, we can actually use the same route name
  app.post('/api/v1/booking', function (req, res) {
    // Get the values we need from the request body and generate a unique id
    // We need to somehow validate that all the bits we need actually exist in the body
    const machineid = req.body.machineid;
    const jobid = req.body.jobid;
    const day = req.body.day
    const timeslot = req.body.timeslot
    // Build insert string
    const querystring = "INSERT INTO bookings (job_id, machine_id, date, timeslot) VALUES ($1, $2, $3, $4);";
    // Call module that will execute insert statement, and provide it with the built query
    db.insertQuery(querystring, [jobid, machineid, day, timeslot], function (err, results) {
      //Report back if there were issues running the insert
      if (err) {
        res.status(500).json(err);
      } else {
        // Otherwise send confirmation back
        // Why not look at res.status, and return user santitised messages depending on the error code
        res.status(200).json(results);
      }
    });	
  });
};
