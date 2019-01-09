apk add --no-cache curl bash apache-ant unzip

curl -s http://getcomposer.org/installer | php
php composer.phar install
ant

apk del curl bash apache-ant unzip