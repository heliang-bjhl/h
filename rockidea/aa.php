<?php
include "wechat.php";

$appid = "wx6b1bd7814c92aaaa";
$secret = "79a8f157e90bb58db1d96b46901a4a7d";

$wechat = new Wechat($appid, $secret);
$tokenJson = $wechat->getToken();
$ticketJson = $wechat->getTicket($tokenJson['access_token']);

//$noncestr = "Wm3WZYTPz0wzccnW";
$noncestr = strtolower(md5(uniqid(mt_rand(), true)));
$url = empty($_GET['url']) ? "" : $_GET['url'];
$url = urldecode($url);
//$url = $_SERVER['REQUEST_URI'];

$signature = $wechat->signature($ticketJson['ticket'], $url, $noncestr);
var_dump($signature);
