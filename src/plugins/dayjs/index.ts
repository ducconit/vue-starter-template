import type { App } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import localeData from 'dayjs/plugin/localeData'
import minMax from 'dayjs/plugin/minMax'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import weekYear from 'dayjs/plugin/weekYear'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import isYesterday from 'dayjs/plugin/isYesterday'
import isoWeeksInYear from 'dayjs/plugin/isoWeeksInYear'
import ObjectSupport from 'dayjs/plugin/objectSupport'
import pluralGetSet from 'dayjs/plugin/pluralGetSet'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'

export default {
  install(app: App) {
    // Tích hợp plugin
    dayjs.extend(relativeTime)
    dayjs.extend(calendar)
    dayjs.extend(customParseFormat)
    dayjs.extend(timezone)
    dayjs.extend(utc)
    dayjs.extend(dayOfYear)
    dayjs.extend(duration)
    dayjs.extend(isBetween)
    dayjs.extend(isSameOrBefore)
    dayjs.extend(isSameOrAfter)
    dayjs.extend(localeData)
    dayjs.extend(minMax)
    dayjs.extend(weekOfYear)
    dayjs.extend(isoWeek)
    dayjs.extend(isLeapYear)
    dayjs.extend(isToday)
    dayjs.extend(isTomorrow)
    dayjs.extend(isYesterday)
    dayjs.extend(isoWeeksInYear)
    dayjs.extend(weekYear)
    dayjs.extend(ObjectSupport)
    dayjs.extend(pluralGetSet)
    dayjs.extend(weekday)
    dayjs.extend(updateLocale, {
      weekStart: 1,
    })

    app.config.globalProperties.$dayjs = dayjs
  },
}
