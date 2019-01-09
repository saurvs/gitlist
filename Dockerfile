FROM alpine:3.7

RUN apk add --no-cache nginx supervisor git
RUN apk add --no-cache php7-fpm php7-cli php7-openssl php7-json \
    php7-phar php7-iconv php7-tokenizer php7-dom php7-ctype php7-simplexml

ADD . /var/www
WORKDIR /var/www
RUN chmod 777 cache
RUN ./docker-build.sh

RUN mkdir -p /run/nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD supervisord -c /etc/supervisor/conf.d/supervisord.conf