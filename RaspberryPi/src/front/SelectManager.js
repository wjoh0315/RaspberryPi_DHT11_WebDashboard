import * as DateUtil from "./utility_front.js";

// HTML Prototype
const GetCheck = {
    "Month": 1,
    "Week": 2,
    "Day": 3,
    "Hour": 4
}

const Prototypes = [
    `
        <p>Year</p>
        <select name="Select_Year" id="Select_Year">
        </select>
    `,
    `
        <p>Month</p>
        <select name="Select_Month" id="Select_Month">
        </select>
    `,
    `
        <p>Week</p>
        <select name="Select_Week" id="Select_Week">
        </select>
    `,
    `
        <p>Weekday</p>
        <select name="Select_Day" id="Select_Day">
        </select>
    `
];

// Collect Start Time
const Start = new Date(2021, 2, 21, 20, 56, 12);

// Local Time
const Now = new Date();

const SetElements_StartedByDate = (year, monthIndex, currentWeek) => {
    const DayElement = document.getElementById("Select_Day");
    const Days = [ 
        "Monday", "Tuesday", "Wednesday", 
        "Thursday", "Friday", "Saturday", "Sunday"  
    ]

    let AmountOfMonth = (monthIndex + 1) % 2 == 0 ? 30 : 31;
    if (monthIndex == 1)
        AmountOfMonth = 28;
    
    const CurrentWeekDate = DateUtil.FirstDayAtWeek(year, monthIndex, currentWeek);
    const StartValue = 0;
    const EndValue = year == Now.getFullYear() && monthIndex == Now.getMonth() 
                    ? ( DateUtil.WeekAtCurrentDate(Now) == currentWeek 
                        ? DateUtil.NodeToKoreaWeekday(Now.getDay()) + 1 : 7) : 7;
    let DayInnerHTML = "";
    
    for (let i = StartValue; i < EndValue; i++)
    {
        const NewDate = new Date(
            CurrentWeekDate.getFullYear(), 
            CurrentWeekDate.getMonth(), 
            CurrentWeekDate.getDate() + i
        );
        const IsToday = NewDate.getFullYear() == Now.getFullYear() 
                    && NewDate.getMonth() == Now.getMonth() 
                    && NewDate.getDate() == Now.getDate()
        DayInnerHTML += `<option value="${i}" ${i == EndValue - 1 ? "selected" : ""}> 
        ${Days[i]} (${NewDate.getMonth() + 1} / ${NewDate.getDate()}${IsToday ? ", Today" : ""})`;
    }

    DayElement.innerHTML = DayInnerHTML;
}

const SetElements_StartedByWeek = (type, year, monthIndex) => {
    const WeekElement = document.getElementById("Select_Week");
    const DateWeekStart = new Date(
        Now.getFullYear(), 
        Now.getMonth(), 
        Now.getDate() - DateUtil.NodeToKoreaWeekday(Now.getDay())
    );

    const StartValue = 1;
    const EndValue = year == DateWeekStart.getFullYear() && monthIndex == DateWeekStart.getMonth() 
                            ? DateUtil.WeekAtCurrentDate(DateWeekStart) 
                            : DateUtil.Weekamount(year, monthIndex);
    let WeekInnerHTML = "";

    for (let i = StartValue; i <= EndValue; i++)
        WeekInnerHTML += `<option value="${i}" ${i == EndValue ? "selected" : ""}> ${i} Week`;

    WeekElement.innerHTML = WeekInnerHTML;

    if (type != "Day")
        SetElements_StartedByDate(
            year, 
            monthIndex, 
            parseInt(WeekElement.options[WeekElement.selectedIndex].value)
        )
}

const SetElements_StartedByMonth = (type, year) => {
    const MonthElement = document.getElementById("Select_Month");
    const Month = [ 
        "January", "February", "March", "April",
        "May", "June", "July", "August", 
        "September", "October", "November", "December" 
    ];
    const DateWeekStart = new Date(
        Now.getFullYear(), 
        Now.getMonth(), 
        Now.getDate() - DateUtil.NodeToKoreaWeekday(Now.getDay())
    );

    const StartValue = 0;
    const EndValue = year == DateWeekStart.getFullYear() ? DateWeekStart.getMonth() : 11;
    let MonthInnerHTML = "";

    for (let i = StartValue; i <= EndValue; i++)
        MonthInnerHTML += `<option value="${i}" ${i == EndValue ? "selected" : ""}> ${Month[i]}`;

    MonthElement.innerHTML = MonthInnerHTML;

    if (type != "Week")
        SetElements_StartedByWeek(
            type, 
            year, 
            parseInt(MonthElement.options[MonthElement.selectedIndex].value)
        );
}

const SetElements_StartedByYear = (type) => {
    const YearElement = document.getElementById("Select_Year");
    let YearInnerHTML = "";

    for (let i = Start.getFullYear(); i <= Now.getFullYear(); i++)
        YearInnerHTML += `<option value="${i}" ${i == Now.getFullYear() ? "selected" : ""}> ${i} Year`;

    YearElement.innerHTML = YearInnerHTML;

    if (type != "Month")
        SetElements_StartedByMonth(
            type, 
            parseInt(YearElement.options[YearElement.selectedIndex].value)
        );
}

const ChangedCallback = {
    OnChanged_Year: () => {
        const YearElement = document.getElementById("Select_Year");
        const TypeElement = document.getElementById("Select_Type");
        const Type = TypeElement.options[TypeElement.selectedIndex].value

        if (Type != "Month")
            SetElements_StartedByMonth(
                Type, 
                parseInt(YearElement.options[YearElement.selectedIndex].value)
            );
    },

    OnChanged_Month: () => {
        const YearElement = document.getElementById("Select_Year");
        const MonthElement = document.getElementById("Select_Month");
        const TypeElement = document.getElementById("Select_Type");
        const Type = TypeElement.options[TypeElement.selectedIndex].value

        if (Type != "Week")
            SetElements_StartedByWeek(
                Type, 
                parseInt(YearElement.options[YearElement.selectedIndex].value), 
                parseInt(MonthElement.options[MonthElement.selectedIndex].value)
            );
    },

    OnChanged_Week: () => {
        const YearElement = document.getElementById("Select_Year");
        const MonthElement = document.getElementById("Select_Month");
        const WeekElement = document.getElementById("Select_Week");
        const TypeElement = document.getElementById("Select_Type");
        const Type = TypeElement.options[TypeElement.selectedIndex].value

        if (Type != "Day")
            SetElements_StartedByDate(
                parseInt(YearElement.options[YearElement.selectedIndex].value), 
                parseInt(MonthElement.options[MonthElement.selectedIndex].value), 
                parseInt(WeekElement.options[WeekElement.selectedIndex].value)
            );
    }
}

const OnChanged_Type = () => {
    const TypeElement = document.getElementById("Select_Type");
    const TypeIndex = document.getElementById("Select_Type").selectedIndex;
    const DivElement = document.getElementById("Select_Proto");

    const Type = TypeElement.options[TypeIndex].value;
    DivElement.innerHTML = "";

    for (let i = 0; i < GetCheck[Type]; i++)
        DivElement.innerHTML += Prototypes[i];

    if (document.getElementById("Select_Year") != null)
        document.getElementById("Select_Year").onchange = ChangedCallback.OnChanged_Year;
    if (document.getElementById("Select_Month") != null)
        document.getElementById("Select_Month").onchange = ChangedCallback.OnChanged_Month;
    if (document.getElementById("Select_Week") != null)
        document.getElementById("Select_Week").onchange = ChangedCallback.OnChanged_Week;

    SetElements_StartedByYear(Type);
}

OnChanged_Type()
document.querySelector('#Select_Type').addEventListener('change', OnChanged_Type);