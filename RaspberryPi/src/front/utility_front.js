const IntToStringWith0 = (Int) => {
    return Int >= 10 ? Int : '0' + Int;
}

export function DateToStringFormat(date) 
{
    const year = date.getFullYear();
    const month = IntToStringWith0(date.getMonth() + 1);
    const day = IntToStringWith0(date.getDate());

    const hours = IntToStringWith0(date.getHours());
    const minutes = IntToStringWith0(date.getMinutes());
    const seconds = IntToStringWith0(date.getSeconds());

    return year + '-' + month + '-' + day + '+' + hours + ':' + minutes + ':' + seconds;
}

export function NodeToKoreaWeekday(currentWeekday)
{
    if (currentWeekday == 0)
        return 6
    
    return currentWeekday - 1
}

export function AmountOfMonth(monthIndex)
{
    let AmountOfMonth = (monthIndex + 1) % 2 == 0 ? 30 : 31;
    if (monthIndex == 1)
        AmountOfMonth = 28;

    return AmountOfMonth;
}

export function Weekamount(year, monthIndex) 
{
    let AmountOfMonth = (monthIndex + 1) % 2 == 0 ? 30 : 31;
    if (monthIndex == 1)
        AmountOfMonth = 28;
        
    const FirstDate = new Date(year, monthIndex, 1);
    const LastDate = new Date(year, monthIndex, AmountOfMonth);
    const WeekDateDiff = (LastDate.getDate() - NodeToKoreaWeekday(FirstDate.getDay()) + (NodeToKoreaWeekday(FirstDate.getDay()) > 0 ? 7 : 1)) 
    - (FirstDate.getDate() - NodeToKoreaWeekday(FirstDate.getDay()) + (NodeToKoreaWeekday(FirstDate.getDay()) < 5 ? 1 : 7));
    const Weekamount = Math.round(WeekDateDiff / 7);

    return Weekamount;
}

export function FirstDayAtWeek(year, monthIndex, currentWeek)
{
    const FirstDate = new Date(year, monthIndex, 1);
    const CurrentWeekDate = new Date(year, monthIndex, (FirstDate.getDate() - NodeToKoreaWeekday(FirstDate.getDay()) + (NodeToKoreaWeekday(FirstDate.getDay()) > 3 ? 7 : 0)) + (currentWeek - 1) * 7);

    return CurrentWeekDate;
}

export function WeekAtCurrentDate(CurrentDate)
{
    let AmountOfMonth = (CurrentDate.getMonth() + 1) % 2 == 0 ? 30 : 31;
    if (CurrentDate.getMonth() == 1)
        AmountOfMonth = 28;

    const FirstDate = new Date(CurrentDate.getFullYear(), CurrentDate.getMonth(), 1)
    const LastDate = new Date(CurrentDate.getFullYear(), CurrentDate.getMonth(), AmountOfMonth);
    const WeekDateDiff = (LastDate.getDate() - NodeToKoreaWeekday(LastDate.getDay()) + (NodeToKoreaWeekday(LastDate.getDay()) > 0 ? 7 : 1)) 
    - (FirstDate.getDate() - NodeToKoreaWeekday(FirstDate.getDay()) + (NodeToKoreaWeekday(FirstDate.getDay()) < 5 ? 1 : 7));
    const Weekamount = Math.round(WeekDateDiff / 7);
    const CurrentWeek = Math.ceil((CurrentDate.getDate() - NodeToKoreaWeekday(CurrentDate.getDay()) + 1) / (WeekDateDiff / Weekamount));

    return CurrentWeek;
}

export function FindDateWithWeek(year, monthIndex, currentWeek, day)
{
    const FirstDate = new Date(year, monthIndex, 1);
    const CurrentWeekDate = new Date(year, monthIndex, (FirstDate.getDate() - NodeToKoreaWeekday(FirstDate.getDay()) + (NodeToKoreaWeekday(FirstDate.getDay()) > 3 ? 7 : 0)) + (currentWeek - 1) * 7);
    CurrentWeekDate.setDate(CurrentWeekDate.getDate() + day);
    
    return CurrentWeekDate;
}

