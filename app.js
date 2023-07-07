const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");



const app = express();

app.use(express.static("public")); // SPECIFIES THE STATIC PUBLIC FOLDER FOR ALL THE CSS
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req , res){
   res.sendFile(__dirname+"/signup.html")
});

app.post('/', function(req,res){
    const firstname= req.body.firstname;
    const lastname=req.body.lastname;
    const email=req.body.email;
   
   const data ={     // JAVASCRIPT OBJECTS 
        members : [
       {
        email_address : email,
        status : "subscribed" , 
        merge_fields : {
            FNAME : firstname,
            LNAME : lastname
        }
       }
        
    ]
   }

   const jsonData = JSON.stringify(data); // CONVERTS JAVASCRIPT OBJ INTO STRING 
   
   const url = "https://us8.api.mailchimp.com/3.0/lists/8b96f9716f ";

   const option ={
    method:"POST",
    auth : "harshita:915ede8d96fb6c3fdbe934fd4753a353-us8"
   }

  const request =  https.request(url , option , function(response){  // OUR JSON DATA IS NOW STORED in request CONSTANT 
    
    if(response.statusCode === 200){   // IF THERE WERE NO ERRORS THEN GOTO THIS FILE 
        res.sendFile(__dirname+"/success.html");
       }
       else {   // ELSE THIS FILEE
        res.sendFile(__dirname+"/failure.html");
       }
    
    
       response.on("data" , function(data){
               console.log(JSON.parse(data));
       })

       
   })
 
   request.write(jsonData); // THIS REQUEST CONSTANT IS USED TO WRITE DATA INTO MAILCHIMP 
   request.end();

})


app.post("/failure" , function(req, res){
    res.redirect("/")
})
app.listen(process.env.PORT || 3000, function(){   // dynamic port that heroku will define 
    console.log("server is running on port 3000")
}) 

//  api key = 915ede8d96fb6c3fdbe934fd4753a353-us8
//  list id = 8b96f9716f