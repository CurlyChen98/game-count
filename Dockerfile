FROM nginxinc/nginx-unprivileged:latest
#FROM registry.openanolis.cn/openanolis/nginx:1.14.1-8.6
USER root
#USER 101


#COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf.template /etc/nginx/templates/
COPY ./dist/payment-admin /usr/share/nginx/html/payment-admin
USER root

RUN chmod a+w -R /etc/nginx/conf.d
#USER 101
