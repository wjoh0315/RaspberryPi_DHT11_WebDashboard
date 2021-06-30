import { DateToStringFormat, FirstDayAtWeek, Weekamount, FindDateWithWeek } from "./utility_front.js";
import config from "./config.js"

const Submit = () => {
    const Elements = {
        TemORHum: document.getElementById("Select_TemORHum"),
        Type: document.getElementById("Select_Type"),
        Year: document.getElementById("Select_Year"),
        Month: document.getElementById("Select_Month"),
        Week: document.getElementById("Select_Week"),
        Day: document.getElementById("Select_Day") 
    }
    
    const Formdata = {
        TemORHum: Elements["TemORHum"].options[Elements["TemORHum"].selectedIndex].value,
        Type: Elements["Type"].options[Elements["Type"].selectedIndex].value,
        Year: Elements["Year"] == null ? null 
            : parseInt(Elements["Year"].options[Elements["Year"].selectedIndex].value),
        Month: Elements["Month"] == null ? null 
            : parseInt(Elements["Month"].options[Elements["Month"].selectedIndex].value),
        Week: Elements["Week"] == null ? null 
            : parseInt(Elements["Week"].options[Elements["Week"].selectedIndex].value),
        Day: Elements["Day"] == null ? null 
        : parseInt(Elements["Day"].options[Elements["Day"].selectedIndex].value)
    }

    const backgroundColor = Formdata["TemORHum"] == "Temperature" 
                            ? "rgba(255, 99, 132, 0.2)" 
                            : "rgba(54, 162, 235, 0.2)";
    const borderColor = Formdata["TemORHum"] == "Temperature" 
                        ? "rgba(255, 99, 132, 0.2)" 
                        : "rgba(54, 162, 235, 0.2)";
    const borderWidth = 3;

    let DateStart, DateEnd;
    let Callback;
    let label;
    let ChartMap = new Map();

    if (Formdata["Type"] == "Month")
    {
        const Month = [ 
            "January", "February", "March", "April",
            "May", "June", "July", "August", 
            "September", "October", "November", "December" 
        ];

        DateStart = `${Formdata["Year"]}-01-01+00:00:00`;
        DateEnd = `${Formdata["Year"]}-12-31+00:00:00`;
        Callback = (element) => {
            if (obj[element] != null)
                ChartMap.set(
                    Month[element["Checkid"]], 
                    element[Formdata["TemORHum"]]
                );
        }
        label = `Yearly ${Formdata["TemORHum"] == "Temperature" 
                ? "Temperature" : "Humidity"} Change`;
    }
    else if (Formdata["Type"] == "Week")
    {
        DateStart = DateToStringFormat(
            FirstDayAtWeek(
                Formdata["Year"], 
                Formdata["Month"], 
                1
            )
        );
        DateEnd = DateToStringFormat(
            FirstDayAtWeek(
                Formdata["Year"], 
                Formdata["Month"], 
                Weekamount(Formdata["Year"], Formdata["Month"])
            )
        );
        Callback = (element) => {
            if (obj[element] != null)
                ChartMap.set(
                    element["Checkid"] + 1 + "Week", 
                    element[Formdata["TemORHum"]]
                );
        }
        label = `Weekly ${Formdata["TemORHum"] == "Temperature" ? "Temperature" : "Humidity"} Change`;
    }
    else if (Formdata["Type"] == "Day")
    {
        const Days = [ 
            "Monday", "Tuesday", "Wednesday", 
            "Thursday", "Friday", "Saturday", "Sunday" 
        ];

        DateStart = DateToStringFormat(
            FirstDayAtWeek(
                Formdata["Year"], 
                Formdata["Month"], 
                Formdata["Week"]
            )
        );
        DateEnd = DateToStringFormat(
            FirstDayAtWeek(
                Formdata["Year"], 
                Formdata["Month"], 
                Formdata["Week"] + 1
            )
        );
        Callback = (element) => {
            const CurrentDate = FindDateWithWeek(
                Formdata["Year"], 
                Formdata["Month"], 
                Formdata["Week"], 
                element["Checkid"]
            );

            ChartMap.set(
                `${Days[element["Checkid"]]}, ${CurrentDate.getMonth() + 1} / ${CurrentDate.getDate()}`
                , element[Formdata["TemORHum"]]
            );
        }
        label = `Daily ${Formdata["TemORHum"] == "Temperature" ? "Temperature" : "Humidity"} Change`;
    }
    else if (Formdata["Type"] == "Hour")
    {
        const CurrentDay = FindDateWithWeek(
            Formdata["Year"], 
            Formdata["Month"], 
            Formdata["Week"], 
            parseInt(Formdata["Day"])
        );
        
        DateStart = DateToStringFormat(CurrentDay);
        CurrentDay.setDate(CurrentDay.getDate() + 1);
        DateEnd = DateToStringFormat(CurrentDay);
        Callback = (element) => {
            const pmam = (element["Checkid"] % 12 == 0 ? 12 : element["Checkid"] % 12)
                    + (element["Checkid"] >= 12 ? " p.m." : " a.m.")
            ChartMap.set(
                pmam, 
                element[Formdata["TemORHum"]]
            );
        }
        label = `Hourly ${Formdata["TemORHum"] == "Temperature" ? "Temperature" : "Humidity"} Change`;
    }

    console.log(DateStart)
    console.log(DateEnd)

    fetch(
    `http://${config.Host}:${config.Port}/GetTemHumData?Type=${Formdata["TemORHum"]}&GetType=${Formdata["Type"]}&DateStart=${DateStart}&DateEnd=${DateEnd}`)
    .then(res => res.json())
    .then((data) => {
        data.message.forEach(Callback);
        const ChartObj = Object.fromEntries(ChartMap);
        const divElement = document.getElementById("ChartDiv");
        if (Object.keys(ChartObj).length == 0)
        {
            divElement.innerHTML = "<p> Null Data </p>";
            return;
        }

        divElement.innerHTML = `<canvas id="Chart" style="width: 500px; height: 250px;"></canvas>`;
        const ctx = document.getElementById("Chart").getContext("2d");
        const NewChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(ChartObj),
                datasets: [{
                    label: label,
                    data: Object.values(ChartObj),
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: borderWidth
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMin: Math.min.apply(null, Object.values(ChartObj)) - 2,
                            suggestedMax: Math.max.apply(null, Object.values(ChartObj)) + 2
                        }
                    }]
                }
            }
        });

        NewChart.canvas.parentNode.style.width = '850px';
        NewChart.canvas.parentNode.style.height = '425px';
    })
    .catch((err) => {
        console.log(err);
    });
}

document.querySelector('#SubmitButton').addEventListener('click', Submit);