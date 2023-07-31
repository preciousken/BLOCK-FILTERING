const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')
const data = require('./data')

app.use(express.json())
app.use(cors())


app.get('/',(req,res)=>{
  return res.status(200).json({
    status:true,
    message:"Api fully functional"
  })
})
//

app.get('/getbyhour/:hour',async (req,res)=>{

    const hour = Number(req.params.hour)
    try {
      const apiUrl = 'https://appslk-second.onrender.com/newEndPoint';
      const response = await axios.get(apiUrl);
           
        function parseISODate(dateString) {
            return new Date(dateString);
          }
          
          // Get the current time.
          const currentTime = new Date();
          
          // Function to filter data based on time frame
          function filterDataByTimeFrame(arrayData, timeFrameHours) {
            return arrayData.filter((obj) => {
              // Check if obj.log_events exists and is an array
              if (Array.isArray(obj.log_events)) {
                return obj.log_events.some((e) => {
                  const blockSignedAtTime = parseISODate(e.block_signed_at);
          
                  // Calculate the time difference (in milliseconds)
                  const timeDifference = currentTime - blockSignedAtTime;
          
                  // Convert the time frame to milliseconds
                  const timeFrameMilliseconds = timeFrameHours * 60 * 60 * 1000;
          
                  return timeDifference <= timeFrameMilliseconds;
                 //return timeDifference <= timeFrameMilliseconds && >= (timeFrameHours - 1)*60*60*100
                });
              }
              return false;
            });
          }

          
          // Filter data for different time frames
          const filteredData = filterDataByTimeFrame(response.data, hour);
          return res.status(200).json({
                        status:true,
                        data:filteredData
                      })       
        
    } catch (error) {
        return res.json({
            status:false,
            message:"something completely went wrong."
        })
    }
    

})
app.listen(5000,()=>{
    console.log('app listening on port 5000')
})

app.use("*",(req,res)=>{
    return res.send('404')
})
