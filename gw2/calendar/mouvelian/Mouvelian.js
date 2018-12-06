// Gregorian Months
const JANUARY = 0;
const FEBRUARY = 1;
const MARCH = 2;
const APRIL = 3;
const MAY = 4;
const JUNE = 5;
const JULY = 6;
const AUGUST = 7;
const SEPTEMBER = 8;
const OCTOBER = 9;
const NOVEMBER = 10;
const DECEMBER = 11;

// Mouvelian Seasons
const ZEPHYR = 0;
const PHOENIX = 1;
const SCION = 2;
const COLOSSUS = 3;

// Difference between Gregorian and Mouvelian Years
const YEAR_DIFFERENCE = 687;

function mouvelianFromDate(date) {
	return mouvelian(asGregorianDate(date.getDate(), date.getMonth(), date.getFullYear()));
}

function asGregorianDate(gDay, gMonth, gYear) {
	if (gYear < 1900 || gYear > 9999 || Number.isNaN(gYear)) {
		throw {
			name: "OutOfRangeException",
			message: "Encountered unsupported Gregorian Year. Supported range is [1900, 9999]; Was: " + gYear,
			prettyMessage: "Year out of range. The supported range for Years is 1900-9999."
		};
	}
	var dim = daysInMonth(gMonth, isLeapYear(gYear));
	if (gDay < 1 || gDay > dim || Number.isNaN(gDay)) {
		throw {
			name: "OutOfRangeException",
			message: "Encountered invalid Gregorian Day for given Month (" + gMonth + "). Valid range is [1, " + dim + "]; Was: " + gDay,
			prettyMessage: "Day out of range. The valid range for Days in the Month of " + gregorianMonthName(gMonth) + (gMonth === FEBRUARY ? " " + gYear : "") + " is 1-" + dim + "."
		};
	}
	var gregorianDate = {
		day: gDay,
		month: gMonth,
		monthName: gregorianMonthName(gMonth),
		year: gYear
	};
	return gregorianDate;
}

function mouvelian(gDate) {
	var mYear = gDate.year-YEAR_DIFFERENCE;
	var mSeason = null;
	var mDay = null;
	switch(gDate.month) {
	case JANUARY:
	case FEBRUARY:
	case MARCH:
		mSeason = ZEPHYR;
		if (isLeapYear(gDate.year)) {
			var leapDay = asGregorianDate(29, FEBRUARY, gDate.year);
			var adjustment = isAfter(gDate, leapDay, true) ? 0 : 1;
			mDay = daysBetween(asGregorianDate(1, JANUARY, gDate.year), gDate)+adjustment;
		} else {
			mDay = daysBetween(asGregorianDate(1, JANUARY, gDate.year), gDate)+1;
		}
		break;
	case APRIL:
	case MAY:
	case JUNE:
		mSeason = PHOENIX;
		mDay = daysBetween(asGregorianDate(1, APRIL, gDate.year), gDate)+1;
		break;
	case JULY:
	case AUGUST:
	case SEPTEMBER:
		mSeason = SCION;
		mDay = daysBetween(asGregorianDate(1, JULY, gDate.year), gDate)+1;
		break;
	case OCTOBER:
	case NOVEMBER:
	case DECEMBER:
		mSeason = COLOSSUS;
		mDay = daysBetween(asGregorianDate(1, OCTOBER, gDate.year), gDate)+1;
		break;
	default:
		throw new Error("Encountered invalid Gregorian Month. Valid range is [0, 12[; Was: " + gDate.month);
	}
	return asMouvelianDate(mDay, mSeason, mYear);
}

function asMouvelianDate(mDay, mSeason, mYear) {
	var mouvelianDate = {
		day: mDay,
		season: mSeason,
		seasonName: mouvelianSeasonName(mSeason),
		year: mYear
	};
	return mouvelianDate;
}

function mouvelianSeasonName(mSeason) {
	switch (mSeason) {
	case ZEPHYR:   return "Zephyr";
	case PHOENIX:  return "Phoenix";
	case SCION:    return "Scion";
	case COLOSSUS: return "Colossus";
	default: throw new Error("Encountered invalid Mouvelian Season. (Valid range is [0, 4[) Was: " + mSeason);
	}
}

function isLeapYear(gYear) {
	if (gYear % 4 == 0) {
		if (gYear % 100 == 0) {
			if (gYear % 400 == 0) {
				return true;
			}
			return false;
		}
		return true;
	}
	return false;
}

function gregorianEqual(gOne, gTwo) {
	return gOne.day === gTwo.day
		&& gOne.month === gTwo.month
		&& gOne.year === gTwo.year;
}

function intCompare(one, two) {
	return one < two ? -1 : (one === two ? 0 : 1);
}

function gregorianCompare(gOne, gTwo) {
	var diff = intCompare(gOne.year, gTwo.year);
	if (diff !== 0) {
		return diff;
	}
	diff = intCompare(gOne.month, gTwo.month);
	if (diff !== 0) {
		return diff;
	}
	return intCompare(gOne.day, gTwo.day);
}

function isAfter(gOne, gTwo, ifEqual) {
	var result = gregorianCompare(gOne, gTwo);
	switch (result) {
	case 1:  return true;
	case 0:  return ifEqual;
	case -1: return false;
	default: throw new Error(result);
	}
}

function daysBetween(gFrom, gTo) {
	if (isAfter(gFrom, gTo, false)) {
		return daysBetween(gTo, gFrom);
	}
	var beginYear = gFrom.year;
	var endYear = gTo.year;
	var beginDayInYear = dayInYear(gFrom);
	var endDayInYear = dayInYear(gTo);
	if (beginYear === endYear) {
		return endDayInYear-beginDayInYear;
	}
	var beginDaysInYear = daysInYear(beginYear);
	var dayDifference = (beginDaysInYear-beginDayInYear)+endDayInYear;
	for (var i=beginYear+1;i < endYear;i++) {
		dayDifference += daysInYear(i);
	}
	return dayDifference;
}

function dayInYear(gDate) {
	var dayInYear = 0;
	var leapYear = isLeapYear(gDate.year);
	for (var i=gDate.month-1;i >= JANUARY;i--) {
		dayInYear += daysInMonth(i, leapYear);
	}
	dayInYear += gDate.day;
	return dayInYear;
}

function daysInMonth(gMonth, isLeapYear) {
	switch (gMonth) {
	case JANUARY:   return 31;
	case FEBRUARY:  return isLeapYear ? 29 : 28;
	case MARCH:     return 31;
	case APRIL:     return 30;
	case MAY:       return 31;
	case JUNE:      return 30;
	case JULY:      return 31;
	case AUGUST:    return 31;
	case SEPTEMBER: return 30;
	case OCTOBER:   return 31;
	case NOVEMBER:  return 30;
	case DECEMBER:  return 31;
	default: throw {
		name: "OutOfRangeException",
		message: "Encountered invalid Gregorian Month. (Valid range is [0, 12[) Was: " + gMonth,
		prettyMessage: "Month out of range. The valid range for Months is 1-12."
	};
	}
}

function daysInYear(gYear) {
	return isLeapYear(gYear) ? 366 : 365;
}

function gregorianMonthName(gMonth) {
	switch (gMonth) {
	case JANUARY:   return "January";
	case FEBRUARY:  return "February";
	case MARCH:     return "March";
	case APRIL:     return "April";
	case MAY:       return "May";
	case JUNE:      return "June";
	case JULY:      return "July";
	case AUGUST:    return "August";
	case SEPTEMBER: return "September";
	case OCTOBER:   return "October";
	case NOVEMBER:  return "November";
	case DECEMBER:  return "December";
	default: throw new Error("Encountered invalid Gregorian Month. (Valid range is [0, 12[) Was: " + gMonth);
	}
}