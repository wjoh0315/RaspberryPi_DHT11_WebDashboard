const DateTimeQueryToDate = (datetime) => {
    const Split = datetime.split(' ');
    const _Date = Split[0];
    const Time = Split[1];
    const DateSplit = _Date.split('-');
    const TimeSplit = Time.split(':');

    return new Date(parseInt(DateSplit[0]), parseInt(DateSplit[1]) - 1, parseInt(DateSplit[2]),
                    parseInt(TimeSplit[0]), parseInt(TimeSplit[1], parseInt(TimeSplit[2])));
}

const ToDateTimeQueryFormat = (date) => {
    const year = date.getFullYear();
    const month = IntToStringWith0(date.getMonth() + 1);
    const day = IntToStringWith0(date.getDate());

    const hours = IntToStringWith0(date.getHours());
    const minutes = IntToStringWith0(date.getMinutes());
    const seconds = IntToStringWith0(date.getSeconds());

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

module.exports = { 
    DateTimeQueryToDate: DateTimeQueryToDate,
    ToDateTimeQueryFormat: ToDateTimeQueryFormat
}