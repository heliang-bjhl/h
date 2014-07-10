// 下拉列表 & 文本字数限制 & 添加帐号
$$m.length = 1;
seajs.use(["$"], function($) {
    $('#save').on('click', function() {
        var qtype = $("input[type=radio][name=qtype]:checked").val();
        location.href = qtype;
    })
    $(function() {
        var op = {
            chart: {
                renderTo: 'container',
                type: 'line'
            },
            title: {
                text: 'Fruit Consumption'
            },
            xAxis: {
                categories: ['Apples', 'Bananas', 'Oranges']
            },
            yAxis: {
                title: {
                    text: 'Fruit eaten'
                }
            },
            series: [{
                name: 'Jane',
                data: [1, 0, 4]
            }, {
                name: 'John',
                data: [5, 7, 3]
            }]
        }
        var chart1 = new Highcharts.Chart(op);
        options.series.push({
            name: 'liang',
            data: [3, 4, 2]
        })
    });
    $$m.itemok('ok');
});
