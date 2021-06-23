const axios = require("axios");
const redis = require("redis");
const moment = require("moment");
const redisPort = 6379
const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
  no_ready_check: true,
  auth_pass: "sharma"
})

redisClient.on('connect', (res) => {
  console.log("Connection Established", res)
})

redisClient.on('error', (err) => {
  console.log("Errror ", err)
})
const WINDOW_SIZE_IN_SECONDS = 5; //Time duration per window
const MAX_WINDOW_REQUEST_COUNT_ADMIN = 6; //Admin can hit 6 API's per 5sec
const MAX_WINDOW_REQUEST_COUNT_EMPLOYEE = 5; //Employee can hit 5 API's per 5sec 
const WINDOW_LOG_INTERVAL_IN_SECONDS = 5; //Time interval

/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config /sails.config.http.html
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Express middleware to use for every Sails request. To add custom          *
  * middleware to the mix, add a function to the middleware config object and *
  * add its key to the "order" array. The $custom key is reserved for         *
  * backwards-compatibility with Sails v0.9.x apps that use the               *
  * `customMiddleware` config option.                                         *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP request. (the Sails *
    * router is invoked by the "router" middleware below.)                     *
    *                                                                          *
    ***************************************************************************/

    order: [
      'customRedisRateLimiter',
      'startRequestTimer',
      'cookieParser',
      'session',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

    /****************************************************************************
    *                                                                           *
    * Example custom middleware; logs each request to the console.              *
    *                                                                           *
    ****************************************************************************/

    customRedisRateLimiter: (req, res, next) => {

      try {
        if (!req.url.includes('/findJobs')) {
          return next()
        }

        // check that redis client exists
        if (!redisClient) {
          throw new Error('Redis client does not exist!');
        }
        const userType = req.query.group

        // fetch records of current user using userType, returns null when no record is found
        redisClient.get(userType, (err, record) => {
          if (err) throw err;
          const currentRequestTime = moment();
          //  if no record is found , create a new record for user and store to redis
          if (record == null) {
            let newRecord = [];
            let requestLog = {
              requestTimeStamp: currentRequestTime.unix(),
              requestCount: 1
            };
            newRecord.push(requestLog);
            redisClient.set(userType, JSON.stringify(newRecord));
            return next();
            //return res.json(JSON.stringify(newRecord));
          }
          // if record is found, parse it's value and calculate number of requests users has made within the last window
          let data = JSON.parse(record);
          let windowStartTimestamp = moment().subtract(WINDOW_SIZE_IN_SECONDS, 'seconds').unix();

          let requestsWithinWindow = data.filter(entry => {
            return entry.requestTimeStamp > windowStartTimestamp;
          })

          let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => {
            return accumulator + entry.requestCount;
          }, 0)

          if ((userType == 'admin' && totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT_ADMIN)
            || (userType == 'employee' && totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT_EMPLOYEE)) {
            return res.status(429)
              .send(`You have exceeded the maximum requests in ${WINDOW_SIZE_IN_SECONDS} seconds  for ${userType} group!`)
          } else {
            // if number of requests made is less than allowed maximum, log new entry
            let lastRequestLog = data[data.length - 1];
            let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
              .subtract(WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds').unix();

            //  if interval has not passed since last request log, increment counter
            if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
              lastRequestLog.requestCount++;
              data[data.length - 1] = lastRequestLog;
              redisClient.set(userType, JSON.stringify(data));
              return next();
            } else {
              //  if interval has passed, log new entry for current user and timestamp
              redisClient.flushdb(function (err, succeeded) {
                // Will be true if successfull
                console.log(succeeded);
                return next();
              })
            }
          }
        });
      } catch (error) {
        next(error);
      }
    },

    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests. By    *
    * default as of v0.10, Sails uses                                          *
    * [skipper](http://github.com/balderdashy/skipper). See                    *
    * http://www.senchalabs.org/connect/multipart.html for other options.      *
    *                                                                          *
    * Note that Sails uses an internal instance of Skipper by default; to      *
    * override it and specify more options, make sure to "npm install skipper" *
    * in your project first.  You can also specify a different body parser or  *
    * a custom function with req, res and next parameters (just like any other *
    * middleware function).                                                    *
    *                                                                          *
    ***************************************************************************/

    // bodyParser: require('skipper')({strict: true})

  },

  /***************************************************************************
  *                                                                          *
  * The number of seconds to cache flat files on disk being served by        *
  * Express static middleware (by default, these files are in `.tmp/public`) *
  *                                                                          *
  * The HTTP static cache is only active in a 'production' environment,      *
  * since that's the only time Express will cache flat-files.                *
  *                                                                          *
  ***************************************************************************/

  // cache: 31557600000
};
