const express = require("express");
const fetch = require("node-fetch");
const axios = require("axios");
const path = require('path');
const app = express();
var users = require("./userdetail.js");
console.log(users);

const fetchTrailheadInfo = async url => {
  console.log(`Fetching ${url}`);
  const trailheadInfo = await axios(url); // API call to get user info from Github.
  console.log(trailheadInfo);
  const result = JSON.parse(trailheadInfo.data.data[0].jsonResponse).data[0];
  return result;
};

const fetchUserInfo = async names => {
  const requests = names.map(name => {
    const url = `https://drm.secure.force.com/services/apexrest/credential?searchString=${name}`;
    return fetchTrailheadInfo(url) // Async function that fetches the user info.
      .then(a => {
        return a; // Returns the user info.
      });
  });
  return Promise.all(requests); // Waiting for all the requests to get resolved.
};

// fetchUserInfo(users).then(a => console.log(JSON.stringify(a)));

app.get("/api/users", (req, res) => {
  fetchUserInfo(users).then(a => res.json(a));
  //   fetch(
  //     "https://drm.secure.force.com/services/apexrest/credential?searchString=rajv.14@gmail.com",
  //     {
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     }
  //   )
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data);
  //       res.json(data.data);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.json(err);
  //     });
});
app.get("/api/customers", (req, res) => {
  const customers = [
    { id: 1, firstName: "John", lastName: "Doe" },
    { id: 2, firstName: "Brad", lastName: "Traversy" },
    { id: 3, firstName: "Mary", lastName: "Swanson" }
  ];
  res.json(customers);
});

//serve static assests if in production
if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port}`);
