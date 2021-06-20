process.chdir(__dirname + "/..");
require("dotenv").config();
const Cors = require("cors");
const Express = require("express");
const Router = require("./router");
const App = Express();

const Host = process.env.Host;
const Port = process.env.Port;

const CorsOption = {
    origin: `http://${Host}`,
    optionsSuccessStatus: 200
};

App.use(Cors(CorsOption), Router);
App.listen(Port, Host, () => {
    console.log(`[Node.js Server]> Server has started at ${Host}:${Port}`);
});