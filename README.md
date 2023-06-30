# MHCAT
MHCAT

首先使用
`npm install`

接著把config.json.temple改成config.json

然後裡面的內容記得更改

這邊只講主要幾個
```
(你的機器人token)
"token" : "",
(你的mongodb資料庫連結，可以到mongodb.com開一個免費的新資料庫)
"mongooseConnectionString": "",
(你的前墜，這已經基本用不到了，不改也沒關係)
"prefix": "/",
(伺服器加入的Webhook)
"joinWebhook": "",
(伺服器退出的Webhook)
"leaveWebhook": "",
(機器人準備好的Webhook)
"readyWebhook": "",
(詐騙網址回報的Webhook)
"reportwebhook": "",
(儀錶板的URL)
"dashboardURL": "",
```

最後使用:
`node shard.js`
就可以跑囉

btw: 這個程式裡面你會看到很多很低級的程式用法www，還請見諒