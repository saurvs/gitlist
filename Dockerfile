FROM alpine:3.7

RUN apk add --no-cache nginx supervisor git \
    php7-fpm php7-cli php7-openssl php7-json php7-phar php7-iconv \
    php7-tokenizer php7-dom php7-ctype php7-simplexml

RUN mkdir -p /run/nginx

ADD . /var/www
WORKDIR /var/www
RUN chmod 777 cache \
    && apk add --no-cache curl bash apache-ant unzip \
    && curl -s http://getcomposer.org/installer | php \
    && php composer.phar install \
    && ant \
    && apk del curl bash apache-ant unzip

COPY docker/config.ini /var/www/config.ini
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD supervisord -c /etc/supervisor/conf.d/supervisord.conf