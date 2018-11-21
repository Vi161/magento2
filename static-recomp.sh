#!/bin/bash
rm -rf var/view_preprocessed/* var/cache/* var/page_cache/* pub/static/*
/Applications/MAMP/bin/php/php7.1.12/bin/php -d memory_limit=-1 bin/magento setup:static-content:deploy en_US -f
/Applications/MAMP/bin/php/php7.1.12/bin/php -d memory_limit=-1 bin/magento dev:source-theme:deploy --theme=Magento/newizze --locale=en_US
/Applications/MAMP/bin/php/php7.1.12/bin/php bin/magento cache:flush
exit 0