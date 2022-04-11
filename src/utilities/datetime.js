import moment from 'moment';

export function parseDate(date) {
    return moment(date).format('ll');
}

export function parseDateTime(date) {
    return moment(date).format('lll');
}

export function parseDateTimeSeconds(date) {
    return moment(date).format('MMM D, YYYY h:mm:ss A');
}

export function parseShortDateTime(date) {
    return moment(date).format('D/M h:mm A');
}