require("dotenv").config();
const Router = require("express").Router();
const DBmanager = require("./DBmanager");
const Utility = require("./utility_back");

Router.get("/GetTemHumData", (req, res) => {
    const TypeEnum = [ "Temperature", "Humidity" ];
    const GetTypeEnum = [ "Month", "Week", "Day", "Hour" ];

    try
    {
        const Type = req.query.Type;
        const GetType = req.query.GetType;
        const DateStart = req.query.DateStart;
        const DateEnd = req.query.DateEnd;

        if (TypeEnum.indexOf(Type) < 0 || GetTypeEnum.indexOf(GetType) < 0)
            res.json(400, {
                message: "Bad Request"
            });
        
        DBmanager.SendQuery(`
            SELECT ${Type}, Checkid 
            FROM TemHumData 
            WHERE Date >= ? AND Date <= ? 
            AND rtype = 'AVR' AND AVRtype = ?`,
        [ DateStart, DateEnd, GetType ],
        {
            SentQuery: (rows) => {
                res.json(200, {
                    message: rows
                });
            },
            AllError: (err) => {
                res.json(400, {
                    message: "Bad Request"
                });
                console.log(err)
            }
        });
    }
    catch(error)
    {
        console.log("POST response process error: " + error);

        res.json(400, {
            message: error
        });
    }
});

module.exports = Router;