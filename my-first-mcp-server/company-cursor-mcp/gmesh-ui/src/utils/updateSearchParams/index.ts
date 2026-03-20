/**
 * 准确地更新浏览器的URL查询参数，防止URL被错误地拼接。
 *
 * @param {Object} params - 要更新或添加的查询参数对象。
 * @param {string} baseUrl - （可选）指定要更新查询参数的基础URL，默认为当前浏览器地址的路径部分。
 */
function updateSearchParams(
    params: any,
    baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname,
) {
    // 解析基础URL
    const newUrl = new URL(baseUrl, window.location.origin);

    // 获取并修改当前的查询参数
    const searchParams = new URLSearchParams(newUrl.search);
    // 遍历并更新查询参数
    Object.keys(params).forEach((key) => {
        if (params[key] === null || params[key] === undefined) {
            searchParams.delete(key); // 删除参数
        } else {
            searchParams.set(key, params[key]); // 更新或添加参数
        }
    });

    // 构造新的URL
    const updatedUrl = `${newUrl.origin}${newUrl.pathname}${
        !params || Object.keys(params).length === 0 || !searchParams.toString() ? '' : '?'
    }${searchParams.toString()}`;

    // 使用history API更新浏览器地址栏，不刷新页面
    window.history.pushState({ path: updatedUrl }, '', updatedUrl);
}

export default updateSearchParams;
