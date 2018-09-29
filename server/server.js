const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express(); 
const fs = require('fs');
const dataFile = './data.json';
const dataFormat = 'utf8';
const http = require('http').Server(app);
const io = require('socket.io')(http);


// CORS
// We are enabling CORS so that our 'ng serve' Angular server can still access
// our Node server. 
const cors = require('cors');
var corsOptions = {
  origin: 'http://ryoma-assignment1-blueanchorite.c9users.io:8081',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204 
  credentials: true
};
app.use(cors(corsOptions));



// Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Routes
app.use(express.static(path.join(__dirname, '../angular-app/dist/angular-app')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'../angular-app/dist/angular-app/index.html'));
});
app.get('/home', function(req,res){
    res.sendFile(path.join(__dirname,'../angular-app/dist/angular-app/index.html'));
});

require('./socket.js')(app, io);

// Login Module
const login = require('./login.js')();
const groups = require('./groups.js')();

app.post('/api/login', function(req, res){
    fs.readFile(dataFile, dataFormat, function(err, data){
        if (err) throw err;
        data = JSON.parse(data);
        let user = req.body;
        let username = req.body.username; 
        login.data = data;
        let match = login.findUser(user);
        
        // Check to see if we have a match, get groups if true
        if(match !== false){
            groups.data = data;
            match.groups = groups.getGroups(username, match.permissions);
        }
        res.send(match);
    });
});


// Group APIs
app.post('/api/groups', function(req,res){
    // We want to authenticate again -- usually you'd use a token
    fs.readFile(dataFile, dataFormat, function(err, data){
        if (err) throw err;
        data = JSON.parse(data);
        let user = req.body;
        let username = req.body.username; 
        login.data = data;
        let match = login.findUser(user);
        
        // Check to see if we have a match, get groups if true
        if(match !== false){
            groups.data = data;
            match.groups = groups.getGroups(username, match.permissions);
        }
        res.send(match);
    });
});

app.delete('/api/group/delete/:groupname', function(req, res){
    let groupName = req.params.groupname;

    // Read the JSON file to get the current data
    fs.readFile(dataFile, dataFormat, function(err, data){
        if (err) throw err;
        let readData = JSON.parse(data);
        groups.data = readData.groups;
        readData.groups = groups.deleteGroup(groupName);
        console.log(readData);
        let json = JSON.stringify(readData);

        // Write the updated data to JSON
        fs.writeFile(dataFile, json, dataFormat, function(err, d){
            if (err) throw err;
            res.send(true);
            console.log("Deleted group: " + groupName);
        });
    });
});

app.post('/api/group/create', function(req, res){
    let groupName = req.body.newGroupName;
    if(groupName == '' || groupName == 'undefined' || groupName == null){
        res.send(false);
    } else {
        // Read the JSON file to get an updated list of groups
        fs.readFile(dataFile, dataFormat, function(err, data){
            if (err) throw err;
            let readData = JSON.parse(data);
            let g = readData.groups;
    
            let newGroup = {
                'name': req.body.newGroupName,
                'admins':[],
                'members':[]
            };
            g.push(newGroup);
            readData.groups = g;
            let json = JSON.stringify(readData, null, 4);
            
            // Write the updated data to the JSON file.
            fs.writeFile(dataFile, json, dataFormat, function(err, data){
                if (err) throw err;
                res.send(true);
                console.log("Created new group: " + req.body.newGroupName);
            });
        });
    }
});
 


// HTTP Listener
var host = process.env.IP;
var port = process.env.PORT;
http.listen(port, host, function(){
    console.log('Server running on 8080');
});
module.exports = app;