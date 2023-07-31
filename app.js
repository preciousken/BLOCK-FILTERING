const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const arrayData = require("./data");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Api fully functional",
  });
});

app.get("/get", async (req, res) => {
  try {
    // Loop through each object in the array
    for (const obj of arrayData) {
      // Initialize the totalValue variable to store the sum of 'value'
      let totalValue = 0;

      // Check if 'log_events' exists and is an array
      if (obj.log_events && Array.isArray(obj.log_events)) {
        // Loop through each log_event in the 'log_events' array of the current object
        for (const logEvent of obj.log_events) {
          // Check if 'decoded' and 'params' exist and are arrays
          if (logEvent.decoded && Array.isArray(logEvent.decoded.params)) {
            // Loop through the 'params' array and sum the 'value' field
            for (const param of logEvent.decoded.params) {
              if (param.name === "value" && !isNaN(Number(param.value))) {
                totalValue += Number(param.value);
              }
            }
          }
        }
      }

      // Add the 'TotalValue' field to the current object
      obj.TotalParamsValue = totalValue;
    }

    // console.log(arrayData);
    // Function to convert the date to "1 Hour Ago" format
    function formatDateToAgo(dateString) {
      const blockSignedAt = new Date(dateString);
      const now = new Date();
      const timeDifference = Math.floor(
        (now - blockSignedAt) / (1000 * 60 * 60)
      ); // Time difference in hours

      if (timeDifference === 1) {
        return "1 Hour Ago";
      } else {
        return timeDifference + " Hours Ago";
      }
    }

    // Loop through each object in the array
    for (const obj of arrayData) {
      // Check if 'log_events' exists and is an array
      if (obj.log_events && Array.isArray(obj.log_events)) {
        // Loop through each log_event in the 'log_events' array of the current object
        for (const logEvent of obj.log_events) {
          // Check if 'block_signed_at' exists and is a valid date string
          if (
            logEvent.block_signed_at &&
            !isNaN(new Date(logEvent.block_signed_at))
          ) {
            // Convert the date to "1 Hour Ago" format and add a new field 'timeFrame'
            logEvent.timeFrame = formatDateToAgo(logEvent.block_signed_at);
          }
        }
      }
    }

    console.log(arrayData);

    return res.status(200).json({
      status: true,
      data: arrayData,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "something completely went wrong.",
    });
  }
});
app.listen(5000, () => {
  console.log("app listening on port 5000");
});

app.use("*", (req, res) => {
  return res.send("404");
});

// const express = require("express");
// const app = express();
// const axios = require("axios");
// const cors = require("cors");
// const data = require("./data");

// app.use(express.json());
// app.use(cors());

// app.get("/", (req, res) => {
//   return res.status(200).json({
//     status: true,
//     message: "Api fully functional",
//   });
// });

// app.get("/getbyhour/:hour", async (req, res) => {
//   const hour = Number(req.params.hour);
//   try {
//     const apiUrl = "https://appslk-second.onrender.com/newEndPoint";
//     const response = await axios.get(apiUrl);

//     function parseISODate(dateString) {
//       return new Date(dateString);
//     }

//     // Get the current time.
//     const currentTime = new Date();

//     // Function to filter data based on time frame
//     function filterDataByTimeFrame(arrayData, timeFrameHours) {
//       return arrayData.filter((obj) => {
//         // Check if obj.log_events exists and is an array
//         if (Array.isArray(obj.log_events)) {
//           return obj.log_events.some((e) => {
//             const blockSignedAtTime = parseISODate(e.block_signed_at);

//             // Calculate the time difference (in milliseconds)
//             const timeDifference = currentTime - blockSignedAtTime;

//             // Convert the time frame to milliseconds
//             const timeFrameMilliseconds = timeFrameHours * 60 * 60 * 1000;
//             return timeDifference <= timeFrameMilliseconds;
//           });
//         }
//         return false;
//       });
//     }

//     // Filter data for different time frames
//     const filteredData = filterDataByTimeFrame(response.data, hour);

//     const totalSum = filteredData.reduce((acc, item) => {
//       const logEvents = item.log_events;

//       // Check if log_events exists and is an array
//       if (Array.isArray(logEvents)) {
//         const eventSum = logEvents.reduce((eventAcc, logEvent) => {
//           const decoded = logEvent.decoded;

//           // Check if decoded exists and has the params property
//           if (decoded && Array.isArray(decoded.params)) {
//             const valueParam = decoded.params.find(
//               (param) => param.name === "value"
//             );

//             // Check if the valueParam exists and its value can be converted to a number
//             if (valueParam && !isNaN(Number(valueParam.value))) {
//               const value = Number(valueParam.value);
//               return eventAcc + value;
//             }
//           }

//           return eventAcc; // If valueParam was not found or was not a valid number, return the current accumulator
//         }, 0);

//         return acc + eventSum;
//       }

//       return acc; // If logEvents was not found or was not an array, return the current accumulator
//     }, 0);

//     return res.status(200).json({
//       status: true,
//       data: filteredData,
//       totalReturns: filteredData.length,
//       totalSumOfParamsValue: totalSum,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       status: false,
//       message: "something completely went wrong.",
//     });
//   }
// });
// app.listen(5000, () => {
//   console.log("app listening on port 5000");
// });

// app.use("*", (req, res) => {
//   return res.send("404");
// });
