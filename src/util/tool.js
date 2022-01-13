import * as dayjs from "dayjs";

/**
 * 获取年度报告的时间
 * @param setting
 */
export function getSelectedTime(setting){
    switch (setting.type ) {
        case 'year':
            return dayjs(setting.year).year() + '年'
        case 'month':
            return dayjs(setting.month).format('YYYY-MM')
        case 'ranger':
            return dayjs(setting.ranger[0]).format('MM-DD') + '至' + dayjs(setting.ranger[1]).format('MM-DD')
        default:
            return ''
    }
}
