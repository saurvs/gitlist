FROM php:fpm-alpine

RUN apk add --no-cache nginx supervisor git \
    php7-cli php7-openssl php7-json php7-phar php7-iconv \
    php7-tokenizer php7-dom php7-ctype php7-simplexml

ADD . /var/www
WORKDIR /var/www
RUN chmod 777 cache \
    && mkdir -p /run/nginx \
    && apk add --no-cache curl bash apache-ant unzip \
    && curl -s http://getcomposer.org/installer | php \
    && php composer.phar install \
    && ant \
    && apk del curl bash apache-ant unzip 

COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD supervisord -c /etc/supervisor/conf.d/supervisord.conf