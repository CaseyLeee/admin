
export function getDay(type, index) {
    console.log(index)
    let weekMap = {
        "zh": ['星期日', "星期一", "星期二", "星期三", "星期四", "星期五", '星期六'],
        "en": ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        "ru": ['Воскресенье', "Понедельник ", " вторник ", " среда ", " четверг ", " пятница "]
    }
    return weekMap[type][index]
}

export function simplifyDay(type, index) {

    let weekMap = {
        "zh": ['日', "一", "二", "三", "四", "五", '六'],
        "en": ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
        "ru": ['ВС', "ПН ", "ВТ", "СР ", " ЧТ ", "ПТ", "СБ"]
    }
    return weekMap[type][index]
}
export function getMonthDays(time) {
    let  date = new Date(time);
    let  year = date.getFullYear();
    let  month = date.getMonth() + 1;
    let  d = new Date(year, month, 0);
    return d.getDate();
}
/**
 * 
 * @param {  } date 
 * 获取当前日期yy-mm-dd
    date 为时间对象
 */
export function getTodayDate(date) {
    let  year = "";
    let  month = "";
    let  day = "";
    let  now = date;
    year = "" + now.getFullYear();
    if ((now.getMonth() + 1) < 10) {
        month = "0" + (now.getMonth() + 1);
    } else {
        month = "" + (now.getMonth() + 1);
    }
    if ((now.getDate()) < 10) {
        day = "0" + (now.getDate());
    } else {
        day = "" + (now.getDate());
    }
    return year + "-" + month + "-" + day;
}
/** 
* 获得相对当前周AddWeekCount个周的起止日期 
* AddWeekCount为0代表当前周   为-1代表上一个周   为1代表下一个周以此类推
* **/
export function getWeekStartAndEnd(AddWeekCount = 0) {
    //起止日期数组   
    let  startStop = new Array();
    //一天的毫秒数   
    let  millisecond = 1000 * 60 * 60 * 24;
    //获取当前时间   
    let  currentDate = new Date();
    //相对于当前日期AddWeekCount个周的日期
    currentDate = new Date(currentDate.getTime() + (millisecond * 7 * AddWeekCount));
    //返回date是一周中的某一天
    let  week = currentDate.getDay();
    //返回date是一个月中的某一天   
    let  month = currentDate.getDate();
    //减去的天数   
    let  minusDay = week != 0 ? week - 1 : 6;
    //获得当前周的第一天   
    let  currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay));
    //获得当前周的最后一天
    let  currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6));
    //添加至数组   
    startStop.push(getTodayDate(currentWeekFirstDay));
    startStop.push(getTodayDate(currentWeekLastDay));

    return startStop;
}
/** 
* 获得相对当月AddMonthCount个月的起止日期 
* AddMonthCount为0 代表当月 为-1代表上一个月  为1代表下一个月 以此类推
* ***/
export function getMonthStartAndEnd(AddMonthCount = 0) {
    //起止日期数组   
    let  startStop = new Array();
    //获取当前时间   
    let  currentDate = new Date();
    let  month = currentDate.getMonth() + AddMonthCount;
    if (month < 0) {
        let  n = parseInt((-month) / 12);
        month += n * 12;
        currentDate.setFullYear(currentDate.getFullYear() - n);
    }
    currentDate = new Date(currentDate.setMonth(month));
    //获得当前月份0-11   
    let  currentMonth = currentDate.getMonth();
    //获得当前年份4位年   
    let  currentYear = currentDate.getFullYear();
    //获得上一个月的第一天   
    let  currentMonthFirstDay = new Date(currentYear, currentMonth, 1);
    //获得上一月的最后一天   
    let  currentMonthLastDay = new Date(currentYear, currentMonth + 1, 0);
    //添加至数组   
    startStop.push(getTodayDate(currentMonthFirstDay));
    startStop.push(getTodayDate(currentMonthLastDay));
    //返回   
    return startStop;
}