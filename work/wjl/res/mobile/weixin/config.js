var $data = {
	cat1 : {
		name : '频道1',
		cat2 : {
			1 : {
				title : 'my first 1'
			}
		}
	},
	game : {
		name : '游戏',
		cat2 : {
			2048 : {
				 title : '2048小游戏'
			}
		}
	},
	wifi : {
		name : 'wifi',
		cat2 : {
			getwifi : {
				 title : '获取wifi'
			},
			fastlogin : {
				 title : '快速登录'
			},
			logined : {
				 title : '登录成功'
			},
			index : {
				 title : 'WiFi首页'
			},
			nav : {
				 title : '导航'
			}
		}
	},
	member : {
		name : '注册',
		cat2 : {
			sign : {
				title : '注册首页'
			},
			signup : {
				title : '注册成功'
			},
			signdown : {
				title : '注册失败'
			},
			login : {
				title : '登录'
			},
			passwd : {
				title : '修改密码'
			},
			restpwd : {
				title : '修改密码成功'
			},
			getpass : {
				title : '找回密码'
			},
			modify : {
				title : '完善资料'
			},
			modifyup : {
				title : '完善资料成功'
			},
			list : {
				title : '公告列表'
			},
			detail : {
				title : '公告'
			},
			index : {
				title : '我的会员卡'
			},
			info : {
				title : '会员卡号'
			},
			right : {
				title : '会员特权'
			},
			mycoupon : {
				title : '我的优惠券'
			},
			myactivity : {
				title : '我的活动'
			},
			mycouponemp : {
				title : '我的优惠券为空'
			},
			myactivityemp : {
				title : '我的活动为空'
			},
			about : {
				title : '关于人信汇'
			},
			error : {
				title : '报错页'
			},
			repwd : {
				title : '找回密码'
			},
			repwdup : {
				title : '找回密码成功'
			}
		}
	},
	message : {
		name : '消息中心',
		cat2 : {
			list : {
				title : '公告列表'
			},
			detail : {
				title : '公告'
			}
		}
	},
	customer : {
		name : '客服中心',
		cat2 : {
			center : {
				title : '客服中心'
			}
		}
	},
	store : {
		name : '找品牌',
		cat2 : {
			list : {
				title : '列表'
			},
			detail : {
				title : '详情'
			},
			search : {
				title : '搜索品牌'
			},
			searchres : {
				title : '搜索结果'
			},
			searchno : {
				title : '搜索无结果'
			},
			storecoupon : {
				title : '品牌优惠券'
			},
			storeactivity : {
				title : '品牌活动'
			}
		}
	},
	food : {
		name : '找美食',
		cat2 : {
			list : {
				title : '列表'
			},
			detail : {
				title : '详情'
			},
			search : {
				title : '搜索店铺'
			},
			searchres : {
				title : '搜索结果'
			},
			searchno : {
				title : '搜索无结果'
			},
			foodcoupon : {
				title : '美食优惠券'
			},
			foodactivity : {
				title : '美食活动'
			}
		}
	},
	coupon : {
		name : '抢优惠券',
		cat2 : {
			list : {
				title : '列表'
			},
			detail : {
				title : '详情'
			},
			buy : {
				title : '下载优惠券'
			}
		}
	},
	activity : {
		name : '参加活动',
		cat2 : {
			list : {
				title : '列表'
			},
			detail : {
				title : '详情'
			},
			sign : {
				title : '报名'
			},
			signup : {
				title : '反馈'
			}
		}
	},
	socre : {
		name : '积分',
		cat2 : {
			list : {
				title : '列表'
			}
		}
	}

}
var host = require('./host.js').rootUrl;
module.exports = {
    configData : $data,
    rootUrl : host
};
