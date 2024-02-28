## 準備工作

克隆項目到本地，配置項目倉庫

```shell
git clone git@codeup.aliyun.com:metaarchit/meta-web/vue-govmo-template.git

git remote remove origin

# 配置項目倉庫（ url 按實際情況填寫）
git remote add origin https://codeup.aliyun.com/metaarchit/xxx/xxx.git

```

### app

配置接口上下文路徑

```
# .env
VUE_APP_API_CONTEXT_PATH=/xxx
```

配置本地開發代理

```
# .env.development

DEV_SERVER_PROXY_TARGET=https://www.metaarchit.com
```

配置本地環境變量（不提交 git）

```
# .env.development.local

# 自行獲取一戶通token，用於本地開發
VUE_APP_DEV_BEARER_ACCESS_TOKEN=Bearer xxxx
# 按需配置本地開發端口
DEV_SERVER_PORT=8081
```

### web

配置接口上下文路徑

```
# .env
VUE_APP_API_CONTEXT_PATH=/xxx
```

配置本地開發代理

```
# .env.development

DEV_SERVER_PROXY_TARGET=https://www.metaarchit.com
```

配置本地環境變量（不提交 git）

```
# .env.development.local

# 按需配置本地開發端口
DEV_SERVER_PORT=8081
```

---
