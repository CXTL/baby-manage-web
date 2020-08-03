
/* 合法uri*/
export function isvalidURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

// 验证密码   密码，必须字母和数字的组合5--10
export function isvalidPass(str) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,10}$/;
  return reg.test(str);
}

//   验证用户名  用户名要求 6~18
export function isvalidUsername(str) {
  return str.trim().length>=6 && str.trim().length<=18
}

// 手机号验证
export function isvalidPhone(str) {
  const reg = /^(13[0-9]|14[5-7]|15[0-9]|17[0-7]|18[0-9]|19[0-9])\d{8}$/;
  return reg.test(str);
}

// 邮箱验证
export function isvalidEmail(str) {
  const reg = /^\w*@[-a-zA-Z0-9]{1,20}\.[0-9a-z]{2,3}$/;
  return reg.test(str);
}
