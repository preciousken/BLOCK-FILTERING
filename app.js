const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const arrayData = require("./data");
//let arrayData;
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
    //arrayData = response.data;
    //console.log(response.data)
    originalData = response.data;
    
    // Loop through each object in the array
    // Function to convert the date to time difference in hours
function getHoursAgo(dateString) {
  const blockSignedAt = new Date(dateString);
  const now = new Date();
  const timeDifference = Math.floor((now - blockSignedAt) / (1000 * 60 * 60)); // Time difference in hours
  return timeDifference;
}

// Filter the array and return only objects with the desired timeFrame
const filteredData = arrayData.filter((obj) => {
  if (obj.log_events && Array.isArray(obj.log_events)) {
    for (const logEvent of obj.log_events) {
      if (logEvent.block_signed_at && !isNaN(new Date(logEvent.block_signed_at))) {
        const timeDifference = getHoursAgo(logEvent.block_signed_at);
        if ([1, 3, 24].includes(timeDifference)) {
          return true;
        }
      }
    }
  }
  return false;
});

// Now 'filteredData' contains objects with log events that are 1 hour ago, 3 hours ago, and 24 hours ago.


    return res.status(200).json({
      status: true,
      data: arrayData
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
