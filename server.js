var express=require("express");
var fileuploader=require("express-fileupload");
const { result } = require("lodash");
var mysql2=require("mysql2");
const status = require("statuses");




var app=express();
app.use(fileuploader());
app.use(express.urlencoded(true));
app.listen(2008,function(){
    console.log("Server Started at Port no: 2008")
})

app.use(express.static("public"));
app.get("/",function(req,resp)
{
    console.log(__dirname);
    console.log(__filename);

    let path=__dirname+"/public/index.html";
    resp.sendFile(path);

})
 let dbConfig="mysql://avnadmin:AVNS_xENfTQ5vV4dBLEy87OW@mysql-34d621e9-deepakshiraj299-df15.c.aivencloud.com:19882/defaultdb?";

    let mySqlVen=mysql2.createConnection(dbConfig);
    mySqlVen.connect(function(errKuch)
    {
        if(errKuch==null)
                console.log("AiVen Connected Successfulllyyy!!!!");
        else
                console.log(errKuch.message)
    })

app.get("/save-user",function(req,resp)
{
    mySqlVen.query("insert into usersss(emailid, pwd, utype) values(?,?,?)",[req.query.email,req.query.pwd,req.query.user],function(err)
{
    if(err==null)
    {
        resp.send("record saved successfully");
    }
    else{
        resp.send(err.message);
    }
})
})
app.get("/login-user", function (req, resp) {
    let email = req.query.email;
    let pwd = req.query.pwd;

    let query = "SELECT * FROM usersss WHERE emailid = ? AND pwd = ?";

    mySqlVen.query(query, [email, pwd], function (err, allRecords) {

        if (allRecords.length == 1) {
            let status = allRecords[0].status;

            if (status == 0)
                resp.send("Blocked");
            else if (status == 1)
                resp.send("Login Succesful");
            
        }
        else {
            resp.send("Wrong emailid / pwd");
        }

    });
});
app.post("/submit-org-details",function(req,resp){
    let email=req.body.email;
     let orgname=req.body.orgname;
      let regno=req.body.regno;
      let address = req.body.address;
let city = req.body.city;
let sports = req.body.sports;
let website = req.body.website;
let insta = req.body.insta;
let head = req.body.head;
let contact = req.body.contact;
let pic = req.body.pic;
let info=req.body.info;
 mySqlVen.query("insert into organiser(emailid,orgname,regnumber,address,city,sports,website,insta,head,contact,picurl,otherinfo) values(?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.email,req.body.orgname,req.body.regno,req.body.address,req.body.city,req.body.sports,req.body.website,req.body.insta,req.body.head,req.body.contact, req.body.pic,req.body.info],function(err){

 

if (err) {
        resp.send(err);
    } else {
        resp.send("Organiser details submitted successfully!");
    }
    })
     

})
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dwxt0yzsl",       
  api_key: "428482712523946",
  api_secret: "oqjPe5XsUvcnD6xfzvinVTqHXOU",
});

app.post("/update-user",async function(req,resp)
{
                
        let email=req.body.email;
     let orgname=req.body.orgname;
      let regno=req.body.regno;
      let address = req.body.address;
let city = req.body.city;
let sports = req.body.sports;
let website = req.body.website;
let insta = req.body.insta;
let head = req.body.head;
let contact = req.body.contact;
let pic = req.body.pic;
let info=req.body.info;

        mySqlVen.query("update users2025 set pwd=?,mobile=?,picurl=? where emailid=?",[pwd,mobile,picurl,emailid],function(errKuch,result)
        {
                if(errKuch==null)
                {
                    if(result.affectedRows==1)
                        resp.send("Record Saved Successfulllyyy....Badhai");
                    else
                        resp.send("Inavlid email Id");
                }
                else 
                    resp.send(errKuch.message)   
        })

})
app.get("/publish-event",function(req,resp)
{
  let emailid =req.query.emaill;
  let event=req.query.title;
  let doe=req.query.date;
  let toe=req.query.time;
  let location=req.query.location;
  let city=req.query.cityy;
  let sports=req.query.category;
  let minage=req.query.minage;
  let maxage=req.query.maxage;
  let lastdate=req.query.lastdate;
  let fee=req.query.fees;
  let prize=req.query.prize;
  let contact=req.query.person;
  
  

    mySqlVen.query("insert into tournaments(emailid, event,doe,toe,location,city,sports,minage,maxage,lastdate,fee,prize,contact) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.query.emaill,req.query.title,req.query.date,req.query.time,req.query.location,req.query.cityy,req.query.category,req.query.minage,req.query.maxage,req.query.lastdate,req.query.fees,req.query.prize,req.query.person],function(err)
{
    if(err==null)
    {
        resp.send("record saved successfully");
    }
    else{
        resp.send(err.message);
    }
})
})
app.post("/player-details", async function(req, resp) {
    let acardpicurl = "";
    let profilepicurl = "";

    // Check if files are uploaded
    if (req.files != null) {
        // Aadhar Pic
        if (req.files.adhaarPic) {
            let fName1 = req.files.adhaarPic.name;
            let fullPath1 = __dirname + "/public/pics/" + fName1;
            req.files.adhaarPic.mv(fullPath1);

            let result1 = await cloudinary.uploader.upload(fullPath1);
            acardpicurl = result1.url; 
            console.log("Aadhar pic URL: " + acardpicurl);
        }

        // Profile Pic
        if (req.files.profilePic) {
            let fName2 = req.files.profilePic.name;
            let fullPath2 = __dirname + "/public/pics/" + fName2;
            req.files.profilePic.mv(fullPath2);

           let result2 = await cloudinary.uploader.upload(fullPath2);
            profilepicurl = result2.url; 
            console.log("Profile pic URL: " + profilepicurl);
        }
    } else {
        // If no new files, use hidden values
        acardpicurl = req.body.hdnAcard;
        profilepicurl = req.body.hdnProfile;
    }

    
    let emailid = req.body.inputemail5;
    let name = req.body.name3;
    let dob = req.body.date;
    let gender = req.body.gender;
    let address = req.body.inputloc1;
    let contact = req.body.inputcontact1;
    let game = req.body.comboUser;
    let otherinfo = req.body.inputinfo;
    

    mySqlVen.query("insert into players(emailid, acardpicurl, profilepicurl,name,dob,gender,address,contact,game,otherinfo) values(?,?,?,?,?,?,?,?,?,?)",
        [emailid,acardpicurl, profilepicurl,name,dob,gender,address,contact,game,otherinfo],
        function(err, result) {
            if (err) {
                console.log(err);
                resp.send("Something went wrong");
            } else {
                resp.send("Uploaded successfully");
            }
        });
});
app.get("/fetch-tournaments", function (req, resp) {
    let email = req.query.emailid;

    mySqlVen.query("SELECT * FROM tournaments WHERE emailid = ?", [email], function (err, result) {
       resp.send(result);
    });
});
app.get("/delete-tournamentmanager", function(req, resp) {
    let rid = req.query.rid;

    mySqlVen.query("DELETE FROM tournaments WHERE rid = ?", [rid], function(err, result) {
        if (err) {
            console.log(err);
            resp.send(err.message);
        } else {
            if(result.affectedRows==1)
            resp.send("Tournament deleted successfully.");
        else
            resp.send("invalid");
        }
    });
});
app.get("/change-password",function(req,resp){
    let emailid=req.query.emailid;
    let oldpwd=req.query.oldpwd;
    let newpwd=req.query.newpwd;
    mySqlVen.query("update usersss set pwd=? where emailid=? and pwd=? ", [newpwd,emailid,oldpwd],function(err,result){
         if (err) {
            console.log(err);
            resp.send(err.message);
        } else {
            if(result.affectedRows==1)
            resp.send("Updated successfully.");
        else
            resp.send("invalid");
        }

    })
    

})
app.get("/dofetchdistinct-sports",function(req,resp)
{
    mySqlVen.query("select distinct sports from tournaments",function(err,result)
        {
            resp.send(result);
        }
    )
})
app.get("/dofetchdistinct-cities",function(req,resp)
{
    mySqlVen.query("select distinct city from tournaments",function(err,result)
        {
            resp.send(result);
        }
    )
})
app.get("/fetch-player-tournaments-cards",function(req,resp)
{
    mySqlVen.query("select * from tournaments where sports=? and city=?",[req.query.selsports,req.query.selcity],function(err,result)
{
    resp.send(result);
})
})
app.get("/fetch-player-tournaments-details",function(req,resp)
{
    mySqlVen.query("select * from tournaments where sports=? and city=?",[req.query.selsports,req.query.selcity],function(err,result)
{
    resp.send(result);
})
})
app.get("/fetch-player-records",function(req,resp)
{
    mySqlVen.query("select * from players",function(err,result)
{
    resp.send(result);
})
})
app.get("/fetch-org-records",function(req,resp)
{
    mySqlVen.query("select * from organiser",function(err,result)
{
    resp.send(result);
})
})




