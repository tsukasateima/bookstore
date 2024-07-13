var data = {
  //云开发环境id
  env: "cloud1-4gweu4m89ff0f881",
  //分享配置
  share_title: "",
  share_img: "/images/poster.jpg", //可以是网络地址，本地文件路径要填绝对位置
  share_poster: "", //必须为网络地址
  //客服联系方式
  kefu: {
    weixin: "JX54004300",
    qq: "",
    gzh: "", //公众号二维码必须为网络地址
    phone: "",
  },
  //默认启动页背景图，防止请求失败完全空白
  //可以是网络地址，本地文件路径要填绝对位置
  bgurl: "/images/startBg.jpg",
  //校区
  campus: [
    {
      name: "华中农业大学",
      id: 0,
    },
    {
      name: "其他高校",
      id: 1,
    },
  ],
  genders:[
    {
      name: '男',
      id: 0
    },{
      name: '女',
      id: 1
    }
  ],
  //配置学院，建议不要添加太多，不然前端不好看
  college: [
    {
      name: "通用",
      id: -1,
    },
    {
      name: "考研",
      id: 0,
    },
    {
      name: "计科",
      id: 1,
    },
    {
      name: "经管",
      id: 2,
    },
    {
      name: "农学",
      id: 4,
    },
    {
      name: "其它",
      id: 7,
    },
  ],
};
function formTime(creatTime) {
  let date = new Date(creatTime),
    Y = date.getFullYear(),
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds();
  if (M < 10) {
    M = "0" + M;
  }
  if (D < 10) {
    D = "0" + D;
  }
  if (H < 10) {
    H = "0" + H;
  }
  if (m < 10) {
    m = "0" + m;
  }
  if (s < 10) {
    s = "0" + s;
  }
  return Y + "-" + M + "-" + D + " " + H + ":" + m + ":" + s;
}

function days() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  let date = year + "" + month + day;
  return date;
}
module.exports = {
  data: JSON.stringify(data),
  formTime: formTime,
  days: days,
};
