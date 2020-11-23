import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const getDatestring = (date) => {
    if(!date) date = new Date();
    return dayjs(date).format("YYYY-MM-DD");
};

const parseDatestring = (datestring) => {
    return dayjs(datestring, "YYYY-MM-DD");
};

export default {getDatestring, parseDatestring};