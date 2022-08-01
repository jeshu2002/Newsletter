const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
  const firstname = req.body.fname
  const lastname = req.body.lname
  const email = req.body.email
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstname,
        LNAME: lastname
      }
    }]
  }

  const jsonData = JSON.stringify(data)

  const endPoint = "https://us10.api.mailchimp.com/3.0/"
  const path = "lists/fbed15438d"
  const url = endPoint + path

  const options = {
    method: "POST",
    // https://mailchimp.com/developer/marketing/docs/fundamentals/#the-basics
    auth: "kollurujeshwanth:381656e3b9d98e0fe66e3415af3af90a-us10"
    // mailchimp documentation Basic HTTP authentication section says anystring:TOKEN
  }
  const request=https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data))
    })
  })
  request.write(jsonData)
  request.end()
})

app.post("/failure", function(req, res) {
  res.redirect("/")
})

app.post("/success", function(req, res) {
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
})

// api key mailchimp
// 381656e3b9d98e0fe66e3415af3af90a-us10
// Audience ID
// fbed15438d
