# cpsRestore

## Initialize:
* Clone this repo
* Run `npm install` to install dependencies
* Make sure you have an Atlas API key created.
* Edit `.env_template` with your Atlas public/private API keys, Project ID, and cluster name.
* Rename `.env_template` to `.env` (or make a new file)

## Run:
* Navigate to the root directory of this project
* Run `node cpsRestore.js`

## Other Thoughts:
* Remember to whitelist the IP address of wherever you are running this application from in the Atlas UI

## TODO:
* Timeout polling of Atlas restore URL api after X minutes to prevent from endless runtime if there is an error
* Do more than console.log the final download URL
* Build a web UI?
