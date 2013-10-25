/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var remoteCouch = 'http://192.168.216.167:5984/phonegap-test1';
var nodejsserver = 'http://192.168.216.167:8888';
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        //var db = new PouchDB('phonegap-test1');
        
        Pouch('phonegap-test1', {}, function (err, db) {
              if (err) {
              console.log("Error while creating database: " + err)
              for( var e in err) {
              console.log("Error element: " + e + " -> "  + err[e]);
              }
              return;
              }
              console.log("Successfully made new database");
              database = db;
              /*
              db.post({_id: 'doc2', title: 'Cony Island Baby' }, {}, function (err, response) {
                      if (!err){
                      console.log("created doc: " + response.ok);
                      console.log("doc id:  " + response.id)
                      console.log("rev: " + response.rev)
                      }else{
                      console.log(err);
                      }
              });
              */
              if (remoteCouch){
              app.syncToRemotePouchDb(db,remoteCouch);
              console.log('Synced data to couch db');
              }
              
              var addButton = document.getElementById('addButton');
              addButton.addEventListener('click',function(){
                                            app.putData(db);
                                         }, false);
              
              var syncButton = document.getElementById('syncButton');
              syncButton.addEventListener('click',function(){
                                         app.syncToRemotePouchDb(db,remoteCouch);
                                         }, false);
              
        });
        var todo = {
            _id: new Date().toISOString(),
            title: "test data title",
            completed: false
        };
        /*
        db.put(todo, function callback(err, result) {
            if (!err) {
               console.log('Successfully posted a todo!');
            }
        });
        */ 

        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    
    syncToRemotePouchDb: function(db,remoteCouch) {
        var opts = {continuous: false, complete: app.syncError};
        db.replicate.to(remoteCouch, opts);
        db.replicate.from(remoteCouch, opts);
    },
    syncError: function(){
        console.log('PouchDB error syncing file');
    },
    putData: function(db){
        db.post(
                {
                _id: new Date().toISOString(),
                title: 'Cony Island Baby'
                }, {}, function (err, response) {
        if (!err){
        console.log("created doc: " + response.ok);
        console.log("doc id:  " + response.id)
        console.log("rev: " + response.rev)
        }else{
        console.log(err);
        }
        });
        
        //console.log("putData1");
    },
    doesUserExist: function(){
        if (window.localStorage.getItem("userexists") === null)
            return false;
        else
            return true;
        
    },
    nodeSignupUser: function(email,password){
        console.log("nodeSignupUser [" + email + "]/[" + password + "]");
        $.post(nodejsserver + "/signup",{email: email, password: password})
        .done(function (data){
              console.log(data);
        });
    },
    nodeSigninUser: function(email,password){
        //test localstorage for user session
        //window.localStorage.setItem(email,password);
        var currentUserPassword = window.localStorage.getItem(email);
        console.log("localStorage Test. email["+ email +"], password["+ currentUserPassword +"]");
        
        console.log("nodeSigninUser [" + email + "]/[" + password + "]");
        $.post(nodejsserver + "/api/user/signin",{"name": email, "password": password})
        .done(function (data){
            console.log(data);
            if (data.ok === true){ //user login successful on remote db server
                console.log("Front end: Login Success.");
                  if (app.doesUserExist() == false){
                        var userSession = {
                        'name': email,
                        'createDate': new Date()
                        };
                        window.localStorage.setItem("userexists", JSON.stringify(userSession));
                  }
            }
            else
                console.log("Front end: Login Fail");
        });
    },
    nodeVerifyUser: function(){
        
        console.log("localStorage Verify. email[test4], password["+ this.doesUserExist() +"]");
        
        console.log("nodeVerifyUser");
        userExistsObj = window.localStorage.getItem("userexists");
        userExistsJSON = JSON.parse(userExistsObj);
        console.log(userExistsJSON.name);
        $.get(nodejsserver + "/api/user/verify",{})
        .done(function (data){
              console.log(data);
        });
    }
    
};
