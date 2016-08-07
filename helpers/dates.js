let moment = require('moment');

class DatesHelper {
    static startOfPastMonth(numMonths) {
        return moment().startOf('month').subtract(numMonths - 1, 'months');
    }

    static convertToRCF3339(aMoment) {
        return aMoment.format("YYYY-MM-DDTHH:mm:ssZ");
    }
}

module.exports = DatesHelper;