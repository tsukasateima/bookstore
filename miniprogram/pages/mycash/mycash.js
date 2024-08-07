

var app = getApp()
var db = wx.cloud.database();
var common = require("../../common.js");
var _ = db.command;
Page({
      data: {
            num: 0,
            key: '',
            times: 1,
      },
      onLoad() {
            this.getTimes();
            this.getnum();
            this.setData({
                  canReflect: app.canReflect
            })
      },
      //获取余额
      getnum() {
            var that = this;
            db.collection('user').where({
                  _openid: app.globalData.openid
            }).get({
                  success: function (res) {
                        console.log(res.data)
                        that.setData({
                              userid: res.data[0]._id,
                              num: res.data[0].parse,
                        });
                  },
                  fail() {
                        that.setData({
                              num: 0,
                        });
                        wx.showToast({
                              title: '获取失败',
                              icon: 'none'
                        })
                  }
            })
      },
      //金额输入
      keyInput(e) {
            this.setData({
                  key: e.detail.value
            })
      },
      //校检
      check(e) {
            var that = this;
            //校检金额不得为空
            if (!that.data.key) {
                  wx.showToast({
                        title: '请输入提现金额',
                        icon: 'none',
                  })
                  return false;
            }
            //校检金额不得低于10元
            var key = parseInt(that.data.key);
            //校检金额不得高于余额
            that.reflectpost();
      },
      //获取当天提现次数
      getTimes() {
            var that = this;
            db.collection('times').where({
                  _openid: app.globalData.openid,
                  days: common.days()
            }).count({
                  success: function (res) {
                        that.setData({
                              times: res.total
                        })
                  },
                  fail() {
                        that.setData({
                              times: 1
                        })
                  }
            })
      },
      //记录
      addTimes() {
            var that = this;
            db.collection('times').add({
                  data: {
                        days: common.days()
                  },
                  success: function (res) {
                  },
                  fail: console.error
            })
      },
      //历史记录
      history(name, num, type) {
            var that = this;
            db.collection('history').add({
                  data: {
                        stamp: new Date().getTime(),
                        type: type, //1充值2支付
                        name: name,
                        num: num,
                        oid: app.globalData.openid,
                  },
                  success: function (res) {
                        // console.log(res)
                  },
                  fail: console.error
            })
      },
      //充值提交
      reflectpost() {
            var that = this;
            wx.showLoading({
                  title: '正在充值...',
            });
            app.canReflect = false;
            that.setData({
                  canReflect: false,
            })
            //利用云开发接口，调用云函数发起订单
            wx.cloud.callFunction({
                  name: 'cash',
                  data: {
                        userid: that.data.userid,
                        num: that.data.key,
                  },
                  success: res => {
                    console.log(res);
                    console.log(that.data.key);
                    if (res.result.result_code == 'SUCCESS') { // 根据修改后的云函数返回结果判断
                      console.log('充值成功！');
                      that.successref();
                    } else {
                      console.log('充值失败！');
                      that.failref();
                    }
                  },
                  fail(err) {
                    that.failref();
                    console.log(err);
                  }
                });
      },
      //提现成功回调
      successref() {
            var that = this;
            //记录今日次数
            that.addTimes();
            that.setData({
                  num: Number(that.data.num)  + Number(that.data.key), 
                  times: 0
            })
            that.history('余额充值', that.data.key, 1);
            wx.hideLoading();
            wx.showToast({
                  title: '充值成功',
                  icon: 'success'
            });
      },
      //提现失败回调
      failref() {
            wx.hideLoading();
            wx.showToast({
                  title: '充值失败，重试',
                  icon: 'none'
            });
            //释放禁用操作
            app.canReflect = true;
            this.setData({
                  canReflect: true,
            })
      },
      money() {
            var that = this;
            db.collection('user').doc(that.data.userid).get({
                  success(res) {
                        that.setData({
                              userInfo: res.data
                        })
                  }
            });
            if (Number(that.data.userInfo.parse) < Number(that.data.key)) {
                return 0;
            }
            //首先获取证书文件
            var fileres = cloud.downloadFile({
                  fileID: config.fileID,
            })
            config.pfx = fileres.fileContent
            var pay = new tenpay(config, true)
            var result = pay.transfers({
                  partner_trade_no: 'bookcash' + Date.now() + that.data.key,
                  openid: userInfo._openid,
                  check_name: 'NO_CHECK',
                  amount: Number(that.data.key) * (100 - config.rate),
                  desc: config.actionName,
            });
            if (result.result_code == 'SUCCESS') {
                  //成功后操作
                  //以下是进行余额计算
                  db.collection('user').doc(that.data.userid).update({
                        data: {
                              parse: Number(that.data.userInfo.parse) + Number(that.data.key)
                        },
                        success: res => {
                              console.log(res)
                              if (res.result == 0) {
                                    console.log('充值失败！');
                                    console.log(res);
                                    that.failref();
                              } else {
                                    console.log('充值成功！');
                                    console.log(res);
                                    that.successref();
                              }
                        },
                        fail(err) {
                              that.failref();
                              console.log(err)
                        }
                  })
            }
      }








})