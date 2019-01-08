FROM ubuntu:14.04
RUN apt-get update
RUN apt-get -y install git nginx-full php5-cli php5-fpm curl ant unzip
RUN mkdir -p -m 777 gitlist
ADD . /var/www/gitlist
WORKDIR /var/www/gitlist/
RUN chmod 777 cache
RUN curl -s http://getcomposer.org/installer | php5
RUN php5 composer.phar install
RUN ant
ADD config.ini /var/www/gitlist/
ADD nginx.conf /etc/

RUN mkdir -p /repos/sentinel
RUN cd /repos/sentinel; git --bare init .

CMD service php5-fpm restart; nginx -c /etc/nginx.conf


