var config = {
      appid: 'wxda1f9e7de1b054cc', //小程序Appid
      envName: 'cloud1-4gweu4m89ff0f881', // 小程序云开发环境ID
      mchid: '158xxxxxx', //商户号
      partnerKey: 'xxxxxxxxxxxxxxxxxx', //此处填服务商密钥32位
      pfx: '', //证书初始化
      fileID: 'cloud://shixianxxxxxxxxxxxxx/apiclient_cert.p12', //证书云存储id
      actionName: '充值',
      rate: 1 //提现收取利率，1指的是每笔收取1%
};

/*
下
面
不
用
管
*/
var cloud = require('wx-server-sdk')
cloud.init({
      env: config.envName
})

var db = cloud.database();
exports.main = async (event, context) => {
  var userInfo = (await db.collection('user').doc(event.userid).get()).data;

  // 模拟充值成功
  try {
    await db.collection('user').doc(event.userid).update({
      data: {
        parse: userInfo.parse + Number(event.num) // 模拟充值增加余额
      }
    });
    return {
      result_code: 'SUCCESS'
    };
  } catch (e) {
    console.log(e);
    return {
      result_code: 'FAIL'
    };
  }
};
// var tenpay = require('tenpay'); //支付核心模块
// exports.main = async (event, context) => {

//       var userInfo = (await db.collection('user').doc(event.userid).get()).data;
//       //     if (userInfo.parse <= Number(event.num)){
//       //           return 0;
//       //     }
//       //首先获取证书文件
//       var fileres = await cloud.downloadFile({
//             fileID: config.fileID,
//       })
//       config.pfx = fileres.fileContent
//       var pay = new tenpay(config, true)
//       var result = await pay.transfers({
//             partner_trade_no: 'bookcash' + Date.now() + Number(event.num),
//             openid: userInfo._openid,
//             check_name: 'NO_CHECK',
//             amount: Number(event.num) - 1,
//             desc: config.actionName,
//       });
//       console.log(result);
//       if (result.result_code == 'SUCCESS') {
//             //成功后操作
//             //以下是进行余额计算
//             try {
//                   return await db.collection('user').doc(event.userid).update({
//                         data: {
//                               parse: userInfo.parse - Number(event.num)
//                         }
//                   })
//             } catch (e) {
//                   console.log(e)
//             }
//             // var res = await db.collection('user').doc(event.userid).update({
//             //       data: {
//             //             parse: Number(userInfo.parse) - Number(event.num)
//             //       }
//             // });
//             // console.log(res);
//             // return res
//       }
// }
