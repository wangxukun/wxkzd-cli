/**
 * 判断ｏbj是不是一个［object Object］类型的普通对象
 * @param obj
 */
function isPlainObject(obj: any): boolean {
    return typeof obj === 'object' && obj !== null && obj.constructor === Object;
}

module.exports = {
    isPlainObject
};