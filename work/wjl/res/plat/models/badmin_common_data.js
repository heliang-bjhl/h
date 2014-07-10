function getData(item) {
    var arr = [];
    var item = item || {
        id: "HD20131001009",
        name: "新款连衣裙",
        shop: "ZARA信阳人信广场店",
        img: "http://myo2ofe.duapp.com/static/images/tmp/111.jpg",
        size: 175,
        color: "红色",
        price: '99.12',
        begin: "2012-12-01",
        end: "2014-09-11",
        status: "已上架"
    }
    for (var i = 0; i < 10; i++) {
        arr.push(item);
    }
    return arr
}

module.exports = {
    activityList: getData()
};