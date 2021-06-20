process.chdir(__dirname + "/..");
require("dotenv").config();
const DB = require("mariadb");
let conn;
console.log("[DBManager]> Getting Connection...");
const Pool = DB.createConnection({
    host: process.env.DB_Host,
    user: process.env.DB_User,
    password: process.env.DB_Password,
    database: "DHT11_Data"
})
.then((poolConn) => {
    conn = poolConn;
    console.log("[DBManager]> Got Connection")
})
.catch((err) => {
    console.error(`Error: [DBManager]> Connection Error, 
                    ${err}`);
});

module.exports = {
    SendQuery: (Query, Fill, CallBacks) => {
        if (typeof conn == "undefined")
            return;

        let ErrorCallback;
        if (typeof CallBacks.AllError != "undefined")
            ErrorCallback = CallBacks.AllError;
        else
            ErrorCallback = () => {}

        conn.query(Query, Fill)
        .then((rows) => { // Send Query
            console.log(`[DBManager]> Sent Query to DHT11_Data`);

            if (typeof CallBacks.SentQuery != "undefined")
                CallBacks.SentQuery(rows);
        })
        .catch((errSecond) => { //Send Query error
            if (typeof CallBacks.QueryError != "undefined")
                CallBacks.QueryError(errSecond);
            else
                ErrorCallback(errSecond);
        });
    }
}
