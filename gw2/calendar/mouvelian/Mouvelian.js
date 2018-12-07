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

class ComparableDate {
	constructor() {
		
	}
	
	isAfter(gOther, ifEqual) {
		var result = this.compareTo(gOther);
		switch (result) {
		case 1:  return true;
		case 0:  return ifEqual;
		case -1: return false;
		default: throw new Error(result);
		}
	}
	
	isBefore(gOther, ifEqual) {
		var result = this.compareTo(gOther);
		switch (result) {
		case 1:  return false;
		case 0:  return ifEqual;
		case -1: return true;
		default: throw new Error(result);
		}
	}
	
	static intCompare(one, two) {
		return one < two ? -1 : (one === two ? 0 : 1);
	}
}

class GregorianDate extends ComparableDate {
	constructor(gDay, gMonth, gYear) {
		super();
		if (gYear < 1900 || gYear > 9999 || Number.isNaN(gYear)) {
			throw {
				name: "OutOfRangeException",
				message: "Encountered unsupported Gregorian Year. Supported range is [1900, 9999]; Was: " + gYear,
				prettyMessage: "Year out of range. The supported range for Years is 1900-9999."
			};
		}
		var dim = GregorianDate.daysInMonth(gMonth, GregorianDate.isLeapYear(gYear));
		if (gDay < 1 || gDay > dim || Number.isNaN(gDay)) {
			throw {
				name: "OutOfRangeException",
				message: "Encountered invalid Gregorian Day for given Month (" + gMonth + "). Valid range is [1, " + dim + "]; Was: " + gDay,
				prettyMessage: "Day out of range. The valid range for Days in the Month of " + GregorianDate.monthName(gMonth) + (gMonth === FEBRUARY ? " " + gYear : "") + " is 1-" + dim + "."
			};
		}
		this.day = gDay;
		this.month = gMonth;
		this.year = gYear;
	}
	
	monthName() {
		return GregorianDate.monthName(this.month);
	}
	
	isLeapYear() {
		return GregorianDate.isLeapYear(this.year);
	}
	
	compareTo(gOther) {
		var diff = ComparableDate.intCompare(this.year, gOther.year);
		if (diff !== 0) {
			return diff;
		}
		diff = ComparableDate.intCompare(this.month, gOther.month);
		if (diff !== 0) {
			return diff;
		}
		return ComparableDate.intCompare(this.day, gOther.day);
	}
	
	equals(gOther) {
		return this.day === gOther.day
			&& this.month === gOther.month
			&& this.year === gOther.year;
	}
	
	dayInYear() {
		var dayInYear = 0;
		var leapYear = this.isLeapYear();
		for (var i=this.month-1;i >= JANUARY;i--) {
			dayInYear += GregorianDate.daysInMonth(i, leapYear);
		}
		dayInYear += this.day;
		return dayInYear;
	}
	
	static today() {
		return GregorianDate.fromDate(new Date()); 
	}
	
	static monthName(gMonth) {
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
	
	static isLeapYear(gYear) {
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
	
	static daysBetween(gFrom, gTo) {
		if (gFrom.isAfter(gTo, false)) {
			return GregorianDate.daysBetween(gTo, gFrom);
		}
		var beginYear = gFrom.year;
		var endYear = gTo.year;
		var beginDayInYear = gFrom.dayInYear();
		var endDayInYear = gTo.dayInYear();
		if (beginYear === endYear) {
			return endDayInYear-beginDayInYear;
		}
		var beginDaysInYear = GregorianDate.daysInYear(beginYear);
		var dayDifference = (beginDaysInYear-beginDayInYear)+endDayInYear;
		for (var i=beginYear+1;i < endYear;i++) {
			dayDifference += GregorianDate.daysInYear(i);
		}
		return dayDifference;
	}
	
	static daysInMonth(gMonth, isLeapYear) {
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
	
	static daysInYear(gYear) {
		return GregorianDate.isLeapYear(gYear) ? 366 : 365;
	}
	
	static fromDate(date) {
		return new GregorianDate(date.getDate(), date.getMonth(), date.getFullYear());
	}
}

class MouvelianDate extends ComparableDate {
	constructor(mDay, mSeason, mYear) {
		super();
		this.day = mDay;
		this.season = mSeason;
		this.year = mYear;
	}
	
	seasonName() {
		return MouvelianDate.mouvelianSeasonName(this.season);
	}
	
	compareTo(mOther) {
		var diff = ComparableDate.intCompare(this.year, mOther.year);
		if (diff !== 0) {
			return diff;
		}
		diff = ComparableDate.intCompare(this.season, mOther.season);
		if (diff !== 0) {
			return diff;
		}
		return ComparableDate.intCompare(this.day, mOther.day);
	}
	
	equals(mOther) {
		return this.day === mOther.day
			&& this.season === mOther.season
			&& this.year === mOther.year;
	}
	
	static fromGregorianDate(gDate) {
		var mYear = gDate.year-YEAR_DIFFERENCE;
		var mSeason = null;
		var mDay = null;
		switch(gDate.month) {
		case JANUARY:
		case FEBRUARY:
		case MARCH:
			mSeason = ZEPHYR;
			if (gDate.isLeapYear()) {
				var leapDay = new GregorianDate(29, FEBRUARY, gDate.year);
				var adjustment = gDate.isAfter(leapDay, true) ? 0 : 1;
				mDay = GregorianDate.daysBetween(new GregorianDate(1, JANUARY, gDate.year), gDate)+adjustment;
			} else {
				mDay = GregorianDate.daysBetween(new GregorianDate(1, JANUARY, gDate.year), gDate)+1;
			}
			break;
		case APRIL:
		case MAY:
		case JUNE:
			mSeason = PHOENIX;
			mDay = GregorianDate.daysBetween(new GregorianDate(1, APRIL, gDate.year), gDate)+1;
			break;
		case JULY:
		case AUGUST:
		case SEPTEMBER:
			mSeason = SCION;
			mDay = GregorianDate.daysBetween(new GregorianDate(1, JULY, gDate.year), gDate)+1;
			break;
		case OCTOBER:
		case NOVEMBER:
		case DECEMBER:
			mSeason = COLOSSUS;
			mDay = GregorianDate.daysBetween(new GregorianDate(1, OCTOBER, gDate.year), gDate)+1;
			break;
		default:
			throw new Error("Encountered invalid Gregorian Month. Valid range is [0, 12[; Was: " + gDate.month);
		}
		return new MouvelianDate(mDay, mSeason, mYear);
	}
	
	static today() {
		return MouvelianDate.fromGregorianDate(GregorianDate.today());
	}
	
	static mouvelianSeasonName(mSeason) {
		switch (mSeason) {
		case ZEPHYR:   return "Zephyr";
		case PHOENIX:  return "Phoenix";
		case SCION:    return "Scion";
		case COLOSSUS: return "Colossus";
		default: throw new Error("Encountered invalid Mouvelian Season. (Valid range is [0, 4[) Was: " + mSeason);
		}
	}
	
	static fromDate(date) {
		return MouvelianDate.fromGregorianDate(GregorianDate.fromDate(date));
	}
}