//importing packages
const request = require('request');
require('dotenv').config();

//setting env variables
const publicKey = process.env.ATLAS_PUBLIC_KEY
const privateKey = process.env.ATLAS_PRIVATE_KEY
const atlasProjectId = process.env.ATLAS_PROJECT_ID
const atlasClusterName = process.env.ATLAS_CLUSTER_NAME

//calls Atlas API and returns id of latest snap
const getRecentSnap  = (callback) => {

  const options = {
    uri: 'https://cloud.mongodb.com/api/atlas/v1.0/groups/' + atlasProjectId + '/clusters/' + atlasClusterName + '/backup/snapshots',
    auth: {
      user: publicKey,
      pass: privateKey,
      sendImmediately: false
    },
    method: 'GET',
    headers: {'content-type' : 'application/json'}
  };

  request(options,function(error, response, body){
    callback(JSON.parse(response.body).results[0].id)
  })

}

const createRestoreJobFromSnapId = (snapId, callback) => {

  const options = {
    uri: 'https://cloud.mongodb.com/api/atlas/v1.0/groups/' + atlasProjectId + '/clusters/' + atlasClusterName + '/backup/restoreJobs',
    auth: {
      user: publicKey,
      pass: privateKey,
      sendImmediately: false
    },
    method: 'POST',
    headers: {'content-type' : 'application/json'},
    body:  JSON.stringify({
          snapshotId : snapId,
          deliveryType : "download"
        })
  };

  request(options,function(error, response, body){
    callback(JSON.parse(response.body).id)
  })

}


//TODO timeout after X requests
const getRestoreDownloadUrl = (callback) => {
  const options = {
    uri: 'https://cloud.mongodb.com/api/atlas/v1.0/groups/' + atlasProjectId + '/clusters/' + atlasClusterName + '/backup/restoreJobs',
    auth: {
      user: publicKey,
      pass: privateKey,
      sendImmediately: false
    },
    method: 'GET',
    headers: {'content-type' : 'application/json'}
  };

  request(options,function(error, response, body){

    //if there is no deliveryUrl, poll in one minute
    if(!JSON.parse(response.body).results[0].deliveryUrl[0]){
      console.log('no results yet. Trying again in a minute')
      setTimeout(getRestoreDownloadUrl,60000,callback)
    }
    else{
      callback(JSON.parse(response.body).results[0].deliveryUrl[0])
    }
  })

}


getRecentSnap(function(snapId){
  createRestoreJobFromSnapId(snapId,function(restoreId){
    getRestoreDownloadUrl(function(url){
      console.log('DOWNLOAD URL = ' + url);
    })
  })
})
