import { format, parseISO, differenceInYears, differenceInMonths } from "date-fns";

/**
 * 格式化最后发送消息的时间描述
 * @param lastMessageTimeString 最后发送消息的时间字符串，格式为ISO 8601
 * @returns 格式化后的时间描述
 */
function formatTime(lastMessageTimeString: string): string {
  try {
    const lastMessageTime = parseISO(lastMessageTimeString);
    const now = new Date();

    // 计算两个日期之间的年数差异
    const yearsDiff = differenceInYears(now, lastMessageTime);

    // 如果在同一年内，计算月份差异
    if (yearsDiff === 0) {
      const monthsDiff = differenceInMonths(now, lastMessageTime);
      if (monthsDiff < 1) {
        // 如果月份差异小于1，显示今天的具体时间
        return `${format(lastMessageTime, "HH:mm")}`;
      } else {
        // 否则显示日期
        return format(lastMessageTime, "yyyy/MM/dd");
      }
    } else {
      // 如果超过一年，显示年份
      return format(lastMessageTime, "yyyy年");
    }
  } catch (e) {
    new Error(`${e}`);
  }
}

export default formatTime;
