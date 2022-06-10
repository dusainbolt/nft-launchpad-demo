import dayjs from 'dayjs';
import Constant from './constant';

export default class Date {
  static isDayjs = (value) => value instanceof dayjs;

  static renderDayjs = (value) => (Date.isDayjs(value) ? value : dayjs(value));

  static toDateStr = (value, format = Constant.DATE.D_M_Y) => Date.renderDayjs(value).format(format);

  static toDateHoursStr = (value, format = Constant.DATE.D_M_Y_H_M) => Date.renderDayjs(value).format(format);
}
