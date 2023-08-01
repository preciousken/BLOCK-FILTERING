const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
// const arrayData = require("./data");
let arrayData;
let originalData;

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
    const apiUrl = "https://appslk-second.onrender.com/newEndPoint";
    const response = await axios.get(apiUrl);
    arrayData = response.data;
    originalData = response.data;
    
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

    // console.log(arrayData);
    function isDesiredTimeFrame(timeFrame) {
      return /^(1|3|24)\s+Hours\s+Ago$/i.test(timeFrame);
    }

    // Filter the array and return only objects with the desired timeFrame
    const filteredData = arrayData.filter((obj) => {
      if (obj.log_events && Array.isArray(obj.log_events)) {
        for (const logEvent of obj.log_events) {
          if (logEvent.timeFrame && isDesiredTimeFrame(logEvent.timeFrame)) {
            return true;
          }
        }
      }
      return false;
    });

    return res.status(200).json({
      status: true...,
      data: originalData,
      helperLog: arrayData[0].log_events.timeFrame,
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
