<?php
	header('Content-type: text/html; charset=UTF-8');
	
	include_once 'interface/common.php';

	session_start();

	if(!empty($_GET) && isset($_GET['openid'])){
		$wxinfo = $_GET;
		$_SESSION['nabaiji_wx'] = $wxinfo;

		saveInfo($wxinfo);
	}else if($_SESSION['nabaiji_wx']){
		$wxinfo = $_SESSION['nabaiji_wx'];

		saveInfo($wxinfo);
	}else{
		header("Location:"."http://kipsta.yuncii.com/worldcup/wechat_author.php?scope=snsapi_base&redirect_uri=http://nabaiji.yuncoupons.com/index.php");
		exit();
	}

	$str = "jsapi_ticket=kgt8ON7yVITDhtdwci0qeY9owq9VMNTb8r3pze3zvtGKUnUW3HiTXMSjpQ3q9Bzm5WqkzzSa9a_9b5uHQLkD1w&noncestr=kc8gilNUArkV0FhF1cwh1DvltnPhnIo8&timestamp=1557028353&url=http://nabaiji.yuncoupons.com/index.php";
	echo sha1($str);

	function saveInfo($info){
		$pdo = getPDO();

		$sql = "SELECT id FROM user_info WHERE openid = :openid";
		$stmt = $pdo->prepare($sql);
		$stmt->bindParam(":openid", $info['openid']);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		if(empty($row)){
			$sql = "INSERT INTO user_info 
						(`openid`, `nickname`, `sex`, `city`, `province`, `country`, `language`, `headimgurl`, `insert_time`, `last_time`) 
					VALUES 
						(:openid, :nickname, :sex, :city, :province, :country, :language, :headimgurl, :now, :now)";
			$stmt = $pdo->prepare($sql);
			$stmt->bindParam(":openid", $info['openid']);
			$stmt->bindParam(":nickname", $info['nickname']);
			$stmt->bindParam(":sex", $info['sex']);
			$stmt->bindParam(":city", $info['city']);
			$stmt->bindParam(":province", $info['province']);
			$stmt->bindParam(":country", $info['country']);
			$stmt->bindParam(":language", $info['language']);
			$stmt->bindParam(":headimgurl", $info['headimgurl']);
			$stmt->bindParam(":now", $now);
			$now = date('Y-m-d H:i:s');
			$stmt->execute();
		}else{
			$sql = "UPDATE user_info SET nickname = :nickname, sex = :sex, city = :city, province = :province, country = :country, language = :language, 
						headimgurl = :headimgurl, last_time = :now WHERE openid = :openid";
			$stmt = $pdo->prepare($sql);
			$stmt->bindParam(":openid", $info['openid']);
			$stmt->bindParam(":nickname", $info['nickname']);
			$stmt->bindParam(":sex", $info['sex']);
			$stmt->bindParam(":city", $info['city']);
			$stmt->bindParam(":province", $info['province']);
			$stmt->bindParam(":country", $info['country']);
			$stmt->bindParam(":language", $info['language']);
			$stmt->bindParam(":headimgurl", $info['headimgurl']);
			$stmt->bindParam(":now", $now);
			$now = date('Y-m-d H:i:s');
			$stmt->execute();
		}

		$stmt = null;
		$pdo = null;
	}
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">

  <title>你的美，由你决定</title>

  <!--http://www.html5rocks.com/en/mobile/mobifying/-->
  <meta name="viewport"
        content="width=device-width,user-scalable=no,initial-scale=1, minimum-scale=1,maximum-scale=1"/>

  <!--https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html-->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="format-detection" content="telephone=no">

  <!-- force webkit on 360 -->
  <meta name="renderer" content="webkit"/>
  <meta name="force-rendering" content="webkit"/>
  <!-- force edge on IE -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
  <meta name="msapplication-tap-highlight" content="no">

  <!-- force full screen on some browser -->
  <meta name="full-screen" content="yes"/>
  <meta name="x5-fullscreen" content="true"/>
  <meta name="360-fullscreen" content="true"/>
  
  <!-- force screen orientation on some browser -->
  <meta name="screen-orientation" content="portrait"/>
  <meta name="x5-orientation" content="portrait">

  <!--fix fireball/issues/3568 -->
  <!--<meta name="browsermode" content="application">-->
  <meta name="x5-page-mode" content="app">

  <!--<link rel="apple-touch-icon" href=".png" />-->
  <!--<link rel="apple-touch-icon-precomposed" href=".png" />-->

  <link rel="stylesheet" type="text/css" href="style-mobile.css"/>
<script src="http://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
</head>
<body>
  <span id="loading">加载中...</span>
  <canvas id="GameCanvas" oncontextmenu="event.preventDefault()" tabindex="0"></canvas>
  <div id="splash">
    <div class="progress-bar stripes">
      <span style="width: 0%"></span>
    </div>
  </div>
  <audio id="audio" src="audio/music.mp3" preload="auto" loop="loop"></audio>
<script src="src/settings.js" charset="utf-8"></script>

<script src="main.js" charset="utf-8"></script>

<script type="text/javascript">
(function () {
    // open web debugger console
    if (typeof VConsole !== 'undefined') {
        window.vConsole = new VConsole();
    }

    var splash = document.getElementById('splash');
    splash.style.display = 'block';

    var cocos2d = document.createElement('script');
    cocos2d.async = true;
    cocos2d.src = window._CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js';

    var engineLoaded = function () {
        document.body.removeChild(cocos2d);
        cocos2d.removeEventListener('load', engineLoaded, false);
        window.boot();

        audioAutoPlay();
    };
    cocos2d.addEventListener('load', engineLoaded, false);
    document.body.appendChild(cocos2d);

    // 自动播放
    var audioAutoPlay = function() {
        var audio = document.getElementById('audio');

        console.log();

        if (window.WeixinJSBridge) {
            WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                audio.play();
            }, false);
        } else {
            document.addEventListener('WeixinJSBridgeReady', function() {
                WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
                    audio.play();
                });
            }, false);
        }

        audio.play();
    }
})();
</script>
</body>
</html>