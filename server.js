const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");
const fs = require("fs");
const path = require("path");
const express = require("express");
const {animals} = require("./data/animals.json");
const PORT = process.env.PORT || 3001;
const app = express();

//express middleware to make images, js, and css available
app.use(express.static("public"));
//parse incoming string or array data
app.use(express.urlencoded({extended: true}));
//parse incoming JSON data
app.use(express.json());
//tell app to use api routes if /api is in the endpoint
app.use("/api", apiRoutes);
//tell app to use html routes if just / is in the endpoint
app.use("/", htmlRoutes);

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});