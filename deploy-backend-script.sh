#!/bin/bash
echo "================================"
docker ps
docker stop notification-panel-backend
docker rm notification-panel-backend
docker rmi shawon1fb/notification-panel-backend
docker run -p 3000:3000 --name notification-panel-backend -e APP_NAME=notification-panel\
                             -e APP_ENV=development\
                             -e APP_MODE=secure\
                             -e APP_LANGUAGE=en\
                             -e APP_TZ=Asia/Jakarta\
                             -e APP_HOST=0.0.0.0\
                             -e APP_PORT=3000\
                             -e APP_DEBUG=false\
                             -e APP_VERSIONING=true\
                             -e APP_VERSION=1\
                             -e APP_HTTP_ON=true\
                             -e APP_JOB_ON=true\
                          	 -e DATABASE_HOST=mongodb+srv://cluster0.nkjzpcx.mongodb.net\
                             -e DATABASE_NAME=notification_panel\
                             -e DATABASE_USER=iotait\
                             -e DATABASE_PASSWORD=ddz5vPPwbvzCHwE\
                             -e DATABASE_DEBUG=false\
                             -e DATABASE_OPTIONS="retryWrites=true&w=majority"\
                             -e MIDDLEWARE_TOLERANCE_TIMESTAMP=5s\
                             -e MIDDLEWARE_TIMEOUT=30s\
                             -e AUTH_JWT_AUDIENCE=https://iotait.com\
                             -e AUTH_JWT_ISSUER=iotait\
                             -e AUTH_JWT_ACCESS_TOKEN_SECRET_KEY=masudValona\
                             -e AUTH_JWT_ACCESS_TOKEN_EXPIRED=30m\
                             -e AUTH_JWT_REFRESH_TOKEN_SECRET_KEY=56854575\
                             -e AUTH_JWT_REFRESH_TOKEN_EXPIRED=7d\
                             -e AUTH_JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRED=30d\
                             -e AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION=30m\
                             -e AUTH_BASIC_TOKEN_CLIENT_ID=grdews\
                             -e AUTH_BASIC_TOKEN_CLIENT_SECRET=1234567890\
                             -e AWS_CREDENTIAL_KEY=AKIASKLI3FAAWUPRMUFA\
                             -e AWS_CREDENTIAL_SECRET=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\
                             -e AWS_S3_REGION=ap-southeast-1\
                             -e AWS_S3_BUCKET=sportsimage\
                              \
                              shawon1fb/notification-panel-backend
echo "================================"