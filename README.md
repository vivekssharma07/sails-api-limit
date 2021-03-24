# SailsAPI Limit Restriciton with redis cache

The routes are configured at routes.js.

Initially default connection is set at connections.js with the localDiskDb using a localdatabase database.

To Use this application:

* Install node.js
* Install sails.js
* Run npm install to install all the dependencies
* Install MongoDB

Optional:
* Install Postman : Test the various apis

And yes, then you are good to go in the development server.
'sails lift' to see the magic.

In order to test the code please follow the following steps.
Start the app by using command :- npm run start
1. Post some data .
  URL :- http://localhost:1337/create
  METHOD :- POST
  Body :- {
            "name" : "Ranjeet",
            "group" : "admin"
        }
  Note :- By default there will be two groups i.e. 
  1. admin  :- API 6 times per 5 sec
  2. employee   :- API 5 times per 5 sec
  configure accordingly under /config/http.js

  After posting the data for admin and employee group the make an API call and check the functionality.

  1.  http://localhost:1337/findJobs?group=admin 
  Error Msg :- You have exceeded the maximum requests in 5 seconds for admin group!
  2. http://localhost:1337/findJobs?group=employee
  Error Msg :- You have exceeded the maximum requests in 5 seconds for employee group!

Incase any doubt in setting up the project or data please let me know.

