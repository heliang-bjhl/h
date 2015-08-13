<?php

class Wechat {

    public $appid;
    public $appsecret;
    public $getTokenUrl="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={{appid}}&secret={{secret}}";
    public $getTicketUrl="https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token={{accessToken}}&type=jsapi";


    public function __construct($appid, $appsecret) {
        $this->appid = $appid;
        $this->appsecret = $appsecret;
    }

    public function getToken() {
        $url = $this->getTokenUrl;
        $url = str_replace("{{appid}}", $this->appid, $url);
        $url = str_replace("{{secret}}", $this->appsecret, $url);
        $data = $this->getJsonData($url, __FUNCTION__);
        return $data;
    }

    public function getTicket($token) {
        $url = $this->getTicketUrl;
        $url = str_replace("{{accessToken}}", $token, $url);
        $data = $this->getJsonData($url, __FUNCTION__);
        return $data;
    }

    public function getJsonData($url, $fileName) {
        $urlMd5 = md5($url);
        $pathName = "./{$fileName}";
        $fileContent = @file_get_contents($pathName);
        $time = time();
        if (empty($fileContent) || $content=json_decode($fileContent) || $content['expires']<$time) {
            $content = $this->request($url);
            $content = json_decode($content, true);
            $content['expires'] = $time+$content['expires_in'];
            $fileContent = json_encode($content);
            file_put_contents($pathName, $fileContent);
        }
        return $content;
    }

    public function signature($ticket, $url="", $noncestr="") {
        $source = array();
        $source['jsapi_ticket'] = $ticket;
        $source['noncestr'] = $noncestr;
        $source['timestamp'] = time();
        $source['url'] = $url;
        $sourceString1 = "";
        
        foreach($source as $k => $v) {
            $sourceString1 .= "{$k}={$v}&";
        }
        $sourceString1 = substr($sourceString1, 0, -1);
        $signature=sha1($sourceString1);
        $source['signature'] = $signature;
        return $source;
    }

    private function request($url) {
        $ch = curl_init();  
        curl_setopt($ch, CURLOPT_URL, $url);  
        curl_setopt($ch, CURLOPT_HEADER, false);  
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);  
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.1 Safari/537.11');  
      
        $res = curl_exec($ch);  
        $rescode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        return $res;
    }
}
