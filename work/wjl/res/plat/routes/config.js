var storeData = require("../models/padmin_store_data.js"),
    activityList = require("../models/padmin_activity_list_data.js"),
    couponsList = require("../models/padmin_coupons_list_data.js"),
    couponsSearch = require("../models/coupons/search.js"),
    voucherList = require("../models/padmin_voucher_list_data.js"),
    orderList = require("../models/padmin_order_data.js"),
    couponsLogList = require("../models/padmin_couponslog_list_data.js"),
    memberList = require("../models/padmin_member_data.js");
    var voucherData = require("../models/badmin_voucher_data.js"),
    orderData = require("../models/badmin_order_data.js"),
    commonData = require("../models/badmin_common_data.js");



var routes = {
    badmin: {
        old :{
            data: {
                newActivity: {
                    level1: "活动管理",
                    level2: "发布活动页面",
                    url: "/badmin/new_activity",
                    view: "badmin/activity_manage/new_activity"
                },
                activityList: {
                    level1: "活动管理",
                    level2: "活动列表页",
                    url: "/badmin/activity_list",
                    view: "badmin/activity_manage/activity_list",
                    ext : { activityList: activityList.data}
                },
                newCoupon: {
                    level1: "优惠券管理",
                    level2: "发布优惠券",
                    url: "/badmin/new_coupon",
                    view: "badmin/coupon/new_coupon"
                },
                newVoucher: {
                    level1: "代金券管理",
                    level2: "发布带金券",
                    url: "/badmin/new_voucher",
                    view: "badmin/voucher/new_voucher"
                },
                validateVoucher: {
                    level1: "代金券管理",
                    level2: "验证带金券",
                    url: "/badmin/voucher_validate",
                    view: "badmin/voucher/voucher_validate",   //voucherData
                    ext : { voucherData: voucherData.data}
                
                },
                order: {
                    level1: "交易数据",
                    level2: "订单记录",
                    url: "/badmin/order",
                    view: "badmin/order_manage/order",
                    ext : { order: orderData.data}
                },
                login: {
                    level1: "登录注册",
                    level2: "登录",
                    url: "/badmin/login",
                    view: "badmin/login/login"
                },
                storePassword: {
                    level1: "商家管理",
                    level2: "商家修改密码",
                    url: "/badmin/store_password",
                    view: "badmin/store/password"
                }
            },
            level1 : 'old'
        },
        coupon: {
            data: {
                couponsVerificotion: {
                    level2: "优惠券核销",
                    url: "/badmin/coupon/verification",
                    view: "badmin/coupon/verification"
                },
                couponsVerificotionRecord: {
                    level2: "核销记录",
                    url: "/badmin/coupon/verificationrecord",
                    view: "badmin/coupon/verificationrecord"
                }
            },
            level1: "优惠券管理"
        },
        statisticAlanalysis: {
            data: {
                statisticAlanalysisCouponsStatic: {
                    level2: "优惠券情况统计",
                    url: "/badmin/statisticalanalysis/couponsstatic",
                    view: "badmin/statisticalanalysis/couponsstatic"
                }
            },
            level1: "统计分析"
        },
        accountManage : {
            data : {
                accountManagePassword : {
                    level2 : '密码修改',
                    url : '/badmin/accountmanage/password',
                    view : 'badmin/accountmanage/password'
                },
                accountMsgDetail : {
                    level2 : '资料详情',
                    url : '/badmin/accountmanage/msgdetail',
                    view : 'badmin/accountmanage/msgdetail'
                }
            },
            level1 : '账号管理'
        },
        bactives : {
            data : {
                bactivesQuery : {
                    level2 : '活动查询',
                    url : '/badmin/actives/query',
                    view : 'badmin/actives/query'
                },
                bactivesDetail : {
                    level2 : '活动详情',
                    url : '/badmin/actives/detail',
                    view : 'badmin/actives/detail'
                },
                bactivesAttention : {
                    level2 : '关注人员名单',
                    url : '/badmin/actives/signup',
                    view : 'badmin/actives/signup'
                }
            },
            level1 : '活动'
        }
    },
    padmin: {
        store: {
            data: {
                manager: {
                    level2: "商家列表",
                    url: "/padmin/store/manager",
                    view: "padmin/store/manager",
                    ext: {
                        storeData: storeData.data
                    }
                },
                create: {
                    level2: "创建商家",
                    url: "/padmin/store/create",
                    view: "padmin/store/create"
                },
                password: {
                    level2: "商家修改密码",
                    url: "/padmin/store/password",
                    view: "padmin/store/password"
                },
                storeBusiMsg: {
                    level2: "商户详情",
                    url: "/padmin/store/busimsg",
                    view: "padmin/store/busimsg"
                }
            },
            level1: "商家管理"
        }, //store
        login: {
            data: {
                login: {

                    level2: "登录",
                    url: "/padmin/login",
                    view: "padmin/login/login"
                }
            },
            level1: "登录"
        }, //login
        info: {
            data: {
                activityList: {

                    level2: "活动列表页",
                    url: "/padmin/info/activity_list",
                    view: "padmin/Information/activity_list",
                    ext: {
                        activityList: couponsList.data
                    }
                },
                infoVoucherList: {

                    level2: "代金券列表页",
                    url: "/padmin/info/voucher_list",
                    view: "padmin/Information/voucher_list",
                    ext: {
                        voucherList: voucherList.data,
                    }
                },
                infoCouponsList: {

                    level2: "优惠券列表页",
                    url: "/padmin/info/coupons_list",
                    view: "padmin/Information/coupons_list",
                    ext: {
                        couponsList: couponsList.data,
                    }
                },
                detail: {

                    level2: "详情页",
                    url: "/padmin/info/detail",
                    view: "padmin/Information/detail"
                }
            },
            level1: "信息管理",

        }, //info
        service: {

            data: {
                serviceOrder: {

                    level2: "订单查询",
                    url: "/padmin/service/order",
                    view: "padmin/service/order",
                    ext: {
                        orderList: orderList.data,
                    }
                },
                serviceMember: {

                    level2: "会员查询",
                    url: "/padmin/service/member",
                    view: "padmin/service/member",
                    ext: {
                        memberList: memberList.data,
                    }
                },
                serviceCoupons: {

                    level2: "优惠券记录",
                    url: "/padmin/service/coupons",
                    view: "padmin/service/coupons",
                    ext: {
                        couponsLogList: couponsLogList.data,
                    }
                },
                serviceVoucher: {

                    level2: "代金券记录",
                    url: "/padmin/service_voucher",
                    view: "padmin/service/voucher"
                },
            },
            level1: "客服后台"

        }, //service
        coupon: {
            data: {
                couponCreate1: {

                    level2: '创建优惠券1',
                    url: '/padmin/couponCreate1',
                    view: 'padmin/coupons/create1'
                },
                couponCreate2: {

                    level2: '创建优惠券2',
                    url: '/padmin/couponCreate2',
                    view: 'padmin/coupons/create2'
                },
                couponCreate3: {

                    level2: '创建优惠券3',
                    url: '/padmin/couponCreate3',
                    view: 'padmin/coupons/create3'
                },
                couponsSearch1: {

                    level2: '优惠券查询-审核',
                    url: '/padmin/couponsSearch1',
                    view: 'padmin/coupons/search_tab1'
                },
                couponsSearch2: {

                    level2: '优惠券查询-未审核',
                    url: '/padmin/couponsSearch2',
                    view: 'padmin/coupons/search_tab2',
                    ext: {
                        couponsList: couponsList.data
                    }
                },
                couponsSearch2: {

                    level2: '优惠券查询-未审核',
                    url: '/padmin/couponsSearch2',
                    view: 'padmin/coupons/search_tab2',
                    ext: {
                        couponsList: couponsList.data
                    }
                },
                couponsDetail: {

                    level2: '优惠券详情',
                    url: '/padmin/couponsDetail',
                    view: 'padmin/coupons/detail',
                    ext: {
                        couponsList: couponsList.data
                    }
                },
                couponsCash: {

                    level2: '现金对账',
                    url: '/padmin/coupons/cash',
                    view: 'padmin/coupons/cash'
                }
            },
            level1: '优惠券管理',
        }, //coupon
        statistics: {
            data: {
                statisticsCoupons: {

                    level2: '优惠券统计',
                    url: '/padmin/statistics/coupons',
                    view: 'padmin/statistics/coupons',
                    ext: {
                        couponsSearch: couponsList.data
                    }
                }
            },
            level1: '统计分析',

        }, //statistics
        msg : {
            data : {
                systemMsg : {
                    level2 : '系统消息',
                    url : '/padmin/msg/system',
                    view : 'padmin/msg/system'
                },
                msgOutbox : {
                    level2 : '发件箱',
                    url : '/padmin/msg/outbox',
                    view : 'padmin/msg/outbox'
                },
                msgNotice1 : {
                    level2 : '消息发布',
                    url : '/padmin/msg/notice1',
                    view : 'padmin/msg/notice1'
                },
                msgNotice2 : {
                    level2 : '公告消息发件箱',
                    url : '/padmin/msg/notice2',
                    view : 'padmin/msg/notice2'
                }
            },
            level1 : '消息管理'
        },
        error : {
            data : {
                404 : {
                    level2 : '404',
                    url : '/padmin/error/404',
                    view : 'padmin/error/404'
                },
                500 : {
                    level2 : '500',
                    url : '/padmin/error/500',
                    view : 'padmin/error/500'
                },
                pendingAudit : {
                    level2 : '创建第三步',
                    url : '/padmin/error/pendingaudit',
                    view : 'padmin/error/pendingaudit'
                },
                errorWelcome : {
                    level2 : '欢迎页面',
                    url : '/padmin/error/welcome',
                    view : 'padmin/error/welcome'
                }
                ,
                errorNoPermi : {
                    level2 : '无权限访问页面',
                    url : '/padmin/error/nopermi',
                    view : 'padmin/error/nopermi'
                }
            },
            level1 : '错误页面'
        },
        actives : {
            data : {
                activesCreate1 : {
                    level2 : '创建活动1',
                    url : '/padmin/actives/create1',
                    view : 'padmin/actives/create1'
                },
                activesCreate2 : {
                    level2 : '创建活动2',
                    url : '/padmin/actives/create2',
                    view : 'padmin/actives/create2'
                },
                activesCreate2merchant : {
                    level2 : '创建活动2商户活动',
                    url : '/padmin/actives/create2merchant',
                    view : 'padmin/actives/create2merchant'
                },
                activesCreate3 : {
                    level2 : '创建活动3',
                    url : '/padmin/actives/create3',
                    view : 'padmin/actives/create3'
                },
                activesCreate : {
                    level2 : '创建活动',
                    url : '/padmin/actives/create',
                    view : 'padmin/actives/create'
                },
                activesDetail : {
                    level2 : '活动详情',
                    url : '/padmin/actives/detail',
                    view : 'padmin/actives/detail'
                },
                activesDetailmerchant : {
                    level2 : '商户活动详情',
                    url : '/padmin/actives/detailmerchant',
                    view : 'padmin/actives/detailmerchant'
                },
                activesManage : {
                    level2 : '活动管理',
                    url : '/padmin/actives/manage',
                    view : 'padmin/actives/manage'
                },
                activesRecommend : {
                    level2 : '活动推荐管理',
                    url : '/padmin/actives/recommend',
                    view : 'padmin/actives/recommend'
                },
                activesAttention : {
                    level2 : '关注人员名单',
                    url : '/padmin/actives/attention',
                    view : 'padmin/actives/attention'
                },
                activesSignup : {
                    level2 : '报名人员名单',
                    url : '/padmin/actives/signup',
                    view : 'padmin/actives/signup'
                },
                activesQuery : {
                    level2 : '活动查询',
                    url : '/padmin/actives/query',
                    view : 'padmin/actives/query'
                }
            },
            level1 : '创建活动'
        },
        examine : {
            data : {
                examineCreate1 : {
                    level2 : '优惠券审核',
                    url : '/padmin/examine/coupons',
                    view : 'padmin/examine/coupons'
                },
                examineActives : {
                    level2 : '活动审核',
                    url : '/padmin/examine/actives',
                    view : 'padmin/examine/actives'
                },
                examineParking : {
                    level2 : '停车券审核',
                    url : '/padmin/examine/parking',
                    view : 'padmin/examine/parking'
                }
            },
            level1 : '审核'
        },
        parking : {
            data : {
                parkingCreate : {
                    level2 : '停车券创建',
                    url : '/padmin/parking/create',
                    view : 'padmin/parking/create'
                },
                parkingDetail : {
                    level2 : '停车券详情',
                    url : '/padmin/parking/detail',
                    view : 'padmin/parking/detail'
                },
                parkingManage : {
                    level2 : '停车券管理',
                    url : '/padmin/parking/manage',
                    view : 'padmin/parking/manage'
                }

            },
            level1 : '停车券'
        },
        configure : {
            data : {
                configureManage : {
                    level2 : '消息类型',
                    url : '/padmin/configure/manage',
                    view : 'padmin/configure/manage'
                },
                configureManage2 : {
                    level2 : '消息模板',
                    url : '/padmin/configure/manage2',
                    view : 'padmin/configure/manage2'
                },
                configureManage3 : {
                    level2 : '商场业态',
                    url : '/padmin/configure/manage3',
                    view : 'padmin/configure/manage3'
                },
                configureManage4 : {
                    level2 : '活动标签',
                    url : '/padmin/configure/manage4',
                    view : 'padmin/configure/manage4'
                },
                configureManage5 : {
                    level2 : '部门配置',
                    url : '/padmin/configure/manage5',
                    view : 'padmin/configure/manage5'
                }

            },
            level1 : '配置管理'
        },
        useStatistics : {
            data : {
                useStatisticsActives : {
                    level2 : '活动统计',
                    url : '/padmin/usestatistics/actives',
                    view : 'padmin/usestatistics/actives'
                },
                useStatisticsCoupons : {
                    level2 : '优惠劵统计',
                    url : '/padmin/usestatistics/coupons',
                    view : 'padmin/usestatistics/coupons'
                },
                useStatisticsParking : {
                    level2 : '停车劵统计',
                    url : '/padmin/usestatistics/parking',
                    view : 'padmin/usestatistics/parking'
                }
            },
            level1 : '使用统计'
        },
        accountManage : {
            data : {
                accountManagePassword : {
                    level2 : '密码修改',
                    url : '/padmin/accountmanage/password',
                    view : 'padmin/accountmanage/password'
                },
                accountBusinessManage : {
                    level2 : '商管账号',
                    url : '/padmin/accountmanage/businessmanage',
                    view : 'padmin/accountmanage/businessmanage'
                },
                accountRolePower : {
                    level2 : '角色权限',
                    url : '/padmin/accountmanage/rolepower',
                    view : 'padmin/accountmanage/rolepower'
                },
                accountPowerSet : {
                    level2 : '权限设置',
                    url : '/padmin/accountmanage/powerset',
                    view : 'padmin/accountmanage/powerset'
                },
                accounMerchantBank : {
                    level2 : '商户账号',
                    url : '/padmin/accountmanage/merchantbank',
                    view : 'padmin/accountmanage/merchantbank'
                }
            },
            level1 : '账号管理'
        },
        busimanage : {
            data : {
                busimanageBusiquery : {
                    level2 : '商户查询',
                    url : '/padmin/busimanage/busiquery',
                    view : 'padmin/busimanage/busiquery'
                },
            },
            level1 : '商户管理'
        },
        member : {
            data : {
                memberList : {
                    level2 : '会员列表',
                    url : '/padmin/member/list',
                    view : 'padmin/member/list'
                },
                memberDetail : {
                    level2 : '会员详情',
                    url : '/padmin/member/detail',
                    view : 'padmin/member/detail'
                },
                memberIntegralDetail: {
                    level2 : '积分详情',
                    url : '/padmin/member/intedetail',
                    view : 'padmin/member/intedetail'
                }
            },
            level1 : '会员'
        },
        integral : {
            data : {
                integralStatistics : {
                    level2 : '积分统计',
                    url : '/padmin/integral/statistics',
                    view : 'padmin/integral/statistics'
                }
            },
            level1 : '积分'
        },
        sms : {
            data : {
                smsSend : {
                    level2 : '短信发送',
                    url : '/padmin/sms/send',
                    view : 'padmin/sms/send'
                },
                smsRepoet : {
                    level2 : '发送报告',
                    url : '/padmin/sms/report',
                    view : 'padmin/sms/report'
                },
                smsAnalyse : {
                    level2 : '报告分析',
                    url : '/padmin/sms/analyse',
                    view : 'padmin/sms/analyse'
                }
            },
            level1 : '短信'
        },
        dataPlat : {
            data : {
                dataMember : {
                    level2 : '会员数据',
                    url : '/padmin/data/member',
                    view : 'padmin/data/member'
                },
                dataMembergrow : {
                    level2 : '会员注册分析',
                    url : '/padmin/data/membergrow',
                    view : 'padmin/data/membergrow'
                },
                dataFloorAnal : {
                    level2 : '楼层流量分析',
                    url : '/padmin/data/flooranal',
                    view : 'padmin/data/flooranal'
                },
                dataPerTimeFlow : {
                    level2 : '客流量时段分析',
                    url : '/padmin/data/perflow',
                    view : 'padmin/data/perflow'
                },
                dataMemberVisit : {
                    level2 : '会员访问分析',
                    url : '/padmin/data/membervisit',
                    view : 'padmin/data/membervisit'
                },
                dataCouponInflu : {
                    level2 : '优惠券对访问影响',
                    url : '/padmin/data/couponinflu',
                    view : 'padmin/data/couponinflu'
                },
                dataOverview : {
                    level2 : '大盘总览',
                    url : '/padmin/data/overview',
                    view : 'padmin/data/overview'
                },
                dataHot : {
                    level2 : '客流密度分析',
                    url : '/padmin/data/hot',
                    view : 'padmin/data/hot'
                },
                dataHeat : {
                    level2 : '客流热度分析',
                    url : '/padmin/data/heat',
                    view : 'padmin/data/heat'
                }
            },
            level1 : '数据平台'
        },
        wifi : {
            data : {
                mobileWifi : {
                    level2 : '手机版WiFi营销广告管理',
                    url : '/padmin/wifi/mwifi',
                    view : 'padmin/wifi/mwifi'
                },
                mobileWifiNew : {
                    level2 : '手机版Wifi营销新建广告',
                    url : '/padmin/wifi/mwifinew',
                    view : 'padmin/wifi/mwifinew'
                },
                mobileWifiEdit : {
                    level2 : '手机版Wifi营销编辑广告',
                    url : '/padmin/wifi/mwifiedit',
                    view : 'padmin/wifi/mwifiedit'
                },
                pcWifi : {
                    level2 : 'PC版WiFi营销广告管理',
                    url : '/padmin/wifi/pwifi',
                    view : 'padmin/wifi/pwifi'
                },
                pcWifiNew : {
                    level2 : 'PC版Wifi营销新建广告',
                    url : '/padmin/wifi/pwifinew',
                    view : 'padmin/wifi/pwifinew'
                },
                pcWifiEdit : {
                    level2 : 'PC版Wifi营销编辑广告',
                    url : '/padmin/wifi/pwifiedit',
                    view : 'padmin/wifi/pwifiedit'
                }
            },
            level1 : 'wifi营销'
        }
    } //padmin
}


module.exports = {
    routes: routes
};
