module.exports = {

    getNoOfDays: function (from, to) {

        let [fromDay, fromMonth, fromYear] = from.split('.');
        let [toDay, toMonth, toYear] = to.split('.');

        var date1 = new Date(fromYear, fromMonth - 1, fromDay);
        var date2 = new Date(toYear, toMonth - 1, toDay);

        // To calculate the time difference of two dates 
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates 
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        return Difference_In_Days


    }
}


