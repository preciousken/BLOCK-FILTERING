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
    function formatDateToAgo(dateString) {
  const blockSignedAt = new Date(dateString);
  const now = new Date();
  const timeDifference = Math.floor((now - blockSignedAt) / (1000 * 60 * 60)); // Time difference in hours

  if (timeDifference === 1) {
    return "1 Hour Ago";
  } else {
    return timeDifference + " Hours Ago";
  }
}

function isDesiredTimeFrame(timeFrame) {
  return /^(1|3|24)\s+Hours\s+Ago$/i.test(timeFrame);
}

const filteredData = [];

for (const obj of arrayData) {
  if (obj.log_events && Array.isArray(obj.log_events)) {
    for (const logEvent of obj.log_events) {
      if (logEvent.block_signed_at && !isNaN(new Date(logEvent.block_signed_at))) {
        logEvent.timeFrame = formatDateToAgo(logEvent.block_signed_at);
        if (isDesiredTimeFrame(logEvent.timeFrame)) {
          filteredData.push(obj);
          break;
        }
      }
    }
  }
}


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
