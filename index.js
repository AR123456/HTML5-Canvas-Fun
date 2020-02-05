const express = require("express");

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send(
    `<div> 
  <form method="POST">
  <input name="email" placeholder="email"/>
  <input name="password" placeholder="password"/>
  <input name="passwordConfirmation" placeholder="password confirmation"/>
  <button>Sign Up</button>
  </form>
  </div>`
  );
});
app.post("/", (req, res) => {
  req.on("data", data => {
    // console.log(data);
    // console.log(data.toString("utf8"));
    // parse and create object
    const parsed = data.toString("utf8").split("&");
    const formData = {};
    for (let pair of parsed) {
      // es6 desturcture here
      const [key, value] = pair.split("=");
      formData[key] = value;
    }
    console.log(formData);
  });
  res.send("account created");
});
app.listen(port, () =>
  console.log(`App is listening of port "http://localhost:${port}"`)
);
