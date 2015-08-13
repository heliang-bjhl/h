<?php
include "wechat.php";

$appid = "wx6b1bd7814c92aaaa";
$secret = "79a8f157e90bb58db1d96b46901a4a7d";

$wechat = new Wechat($appid, $secret);
$tokenJson = $wechat->getToken();
$ticketJson = $wechat->getTicket($tokenJson['access_token']);

//$noncestr = "Wm3WZYTPz0wzccnW";
$noncestr = strtolower(md5(uniqid(mt_rand(), true)));


$url = 'http://www.rockidea.cn/weixin.php';
// $url = empty($_GET['url']) ? "" : $_GET['url'];
$url = urldecode($url);
//$url = $_SERVER['REQUEST_URI'];

$signature = $wechat->signature($ticketJson['ticket'], $url, $noncestr);
// var_dump($signature);
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1, width=device-width, maximum-scale=1, user-scalable=no" />

    <title>weixin</title>
    <style type="text/css">
html{height:100%}
body{height:100%;margin:0px;padding:0px}
#container{height:100%}
</style>
</head>

<body>

    <div id="container"></div>
    <script src="http://webapi.amap.com/maps?v=1.3&key=bc194a4665295b2a178af2b78cb1a714" type="text/javascript"></script>

    <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>

    <script type="text/javascript">
    wx.config({
        debug: true,
        appId: 'wx6b1bd7814c92aaaa',
        timestamp: <?php echo $signature['timestamp'];?>,
        nonceStr: '<?php echo $signature['noncestr'];?>',
        signature: '<?php echo $signature['signature'];?>',
        jsApiList: ['checkJsApi']
    });
    </script>
    <script type="text/javascript" src="http://10.59.61.10/lejs/wx.js"></script>
</body>
</html>
