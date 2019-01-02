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
	
	isAfter(other, ifEqual) {
		var result = this.compareTo(other);
		switch (result) {
		case 1:  return true;
		case 0:  return ifEqual;
		case -1: return false;
		default: throw new Error(result);
		}
	}
	
	isBefore(other, ifEqual) {
		var result = this.compareTo(other);
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

function zeroPrefix(nr, length) {
	var str = "" + nr;
	while (str.length < length) {
		str = "0" + str;
	}
	return str;
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
		var daysInMonth = GregorianDate.daysInMonth(gMonth, GregorianDate.isLeapYear(gYear));
		if (gDay < 1 || gDay > daysInMonth || Number.isNaN(gDay)) {
			throw {
				name: "OutOfRangeException",
				message: "Encountered invalid Gregorian Day for given Month (" + gMonth + "). Valid range is [1, " + daysInMonth + "]; Was: " + gDay,
				prettyMessage: "Day out of range. The valid range for Days in the Month of " + GregorianDate.monthName(gMonth) + (gMonth === FEBRUARY ? " " + gYear : "") + " is 1-" + daysInMonth + "."
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
		var isLeapYear = this.isLeapYear();
		for (var i=this.month-1;i >= JANUARY;i--) {
			dayInYear += GregorianDate.daysInMonth(i, isLeapYear);
		}
		dayInYear += this.day;
		return dayInYear;
	}
	
	toString() {
		return this.year + "-" + zeroPrefix(this.month+1, 2) + "-" + zeroPrefix(this.day, 2);
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
		default: throw new Error("Encountered invalid Gregorian Month. Valid range is [0, 12[; Was: " + gMonth);
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
			message: "Encountered invalid Gregorian Month. (alid range is [0, 12[; Was: " + gMonth,
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
	
	static fromMouvelianDate(mDate) {
		var gYear = mDate.year+YEAR_DIFFERENCE;
		var isLeapYear = GregorianDate.isLeapYear(gYear);
		var gMonth = -1, gDay = -1, daysInQuater = 0;
		switch (mDate.season) {
		case ZEPHYR:
			var daysInMonth = 0;
			for (var month=JANUARY;month <= MARCH;month++) {
				gDay = mDate.day-daysInQuater;
				daysInMonth = GregorianDate.daysInMonth(month, isLeapYear);
				daysInQuater += daysInMonth;
				if (mDate.day <= daysInQuater) {
					gMonth = month;
					break;
				}
			}
			if (isLeapYear) {
				var leapDay = MouvelianDate.fromGregorianDate(new GregorianDate(29, FEBRUARY, gYear));
				gDay += mDate.isAfter(leapDay, false) ? 1 : 0;
				if (gDay > daysInMonth) {
					gMonth++;
					gDay = gDay-daysInMonth;
				}
			}
			break;
		case PHOENIX:
			for (var month=APRIL;month <= JUNE;month++) {
				gDay = mDate.day-daysInQuater;
				daysInQuater += GregorianDate.daysInMonth(month, isLeapYear);
				if (mDate.day <= daysInQuater) {
					gMonth = month;
					break;
				}
			}
			break;
		case SCION:
			for (var month=JULY;month <= SEPTEMBER;month++) {
				gDay = mDate.day-daysInQuater;
				daysInQuater += GregorianDate.daysInMonth(month, isLeapYear);
				if (mDate.day <= daysInQuater) {
					gMonth = month;
					break;
				}
			}
			break;
		case COLOSSUS:
			for (var month=OCTOBER;month <= DECEMBER;month++) {
				gDay = mDate.day-daysInQuater;
				daysInQuater += GregorianDate.daysInMonth(month, isLeapYear);
				if (mDate.day <= daysInQuater) {
					gMonth = month;
					break;
				}
			}
			break;
		default:
			throw new Error("Encountered invalid Mouvelian Season. Valid range is [0, 4[; Was: " + mDate.season);
		}
		return new GregorianDate(gDay, gMonth, gYear);
	}
}

class MouvelianDate extends ComparableDate {
	constructor(mDay, mSeason, mYear) {
		super();
		var mLower = 1900-YEAR_DIFFERENCE;
		var mUpper = 9999-YEAR_DIFFERENCE;
		if (mYear < mLower || mYear > mUpper || Number.isNaN(mYear)) {
			throw {
				name: "OutOfRangeException",
				message: "Encountered unsupported Mouvelian Year. Supported range is [" + mLower + ", " + mUpper + "]; Was: " + mYear,
				prettyMessage: "Year out of range. The supported range for Years is " + mLower + "-" + mUpper + "."
			};
		}
		var seasonUpperDayBound = MouvelianDate.seasonUpperDayBound(mSeason);
		if (mDay < 1 || mDay > seasonUpperDayBound || Number.isNaN(mDay)) {
			throw {
				name: "OutOfRangeException",
				message: "Encountered invalid Mouvelian Day for given Season (" + mSeason + "). Valid range is [1, " + seasonUpperDayBound + "]; Was: " + mDay,
				prettyMessage: "Day out of range. The valid range for Days in the Season of " + MouvelianDate.seasonName(mSeason) + " is 1-" + seasonUpperDayBound + "."
			};
		}
		this.day = mDay;
		this.season = mSeason;
		this.year = mYear;
	}
	
	seasonName() {
		return MouvelianDate.seasonName(this.season);
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
	
	toString() {
		return this.day + " " + this.seasonName() + " " + this.year;
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
	
	static seasonName(mSeason) {
		switch (mSeason) {
		case ZEPHYR:   return "Zephyr";
		case PHOENIX:  return "Phoenix";
		case SCION:    return "Scion";
		case COLOSSUS: return "Colossus";
		default: throw new Error("Encountered invalid Mouvelian Season. Valid range is [0, 4[; Was: " + mSeason);
		}
	}
	
	static fromDate(date) {
		return MouvelianDate.fromGregorianDate(GregorianDate.fromDate(date));
	}
	
	static daysInSeason(mSeason, isLeapYear) {
		switch (mSeason) {
		case ZEPHYR:   return isLeapYear ? 91 : 90;
		case PHOENIX:  return 91;
		case SCION:    return 92;
		case COLOSSUS: return 92;
		default: throw {
			name: "OutOfRangeException",
			message: "Encountered invalid Mouvelian Season. Valid range is [0, 4[; Was: " + mSeason,
			prettyMessage: "Season out of range. The valid range for Seasons is 1-4. (Zephyr -> Phoenix -> Scion -> Colossus)"
		};
		}
	}
	
	static seasonUpperDayBound(mSeason) {
		switch (mSeason) {
		// As i understand the Calendar, during Leap Years, the Season of Zephyr has 91 Days; two of which share the same Date however (assuming that the 28 and 29 of February are both represented by the 59 of Zephyr). This would yield 90 as the upper bound, as far as the numerical value for the Day is concearned at least; having the 58 of Zephyr followed by the 59 of Zephyr twice, translating to either the 28 or the 29 of February respectively.
		case ZEPHYR:   return 90;
		case PHOENIX:  return 91;
		case SCION:    return 92;
		case COLOSSUS: return 92;
		default: throw {
			name: "OutOfRangeException",
			message: "Encountered invalid Mouvelian Season. Valid range is [0, 4[; Was: " + mSeason,
			prettyMessage: "Season out of range. The valid choices for Seasons are: Zephyr -> Phoenix -> Scion -> Colossus."
		};
		}
	}
}