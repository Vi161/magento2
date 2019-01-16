.#!/bin/bash
php -d memory_limit=-1 bin/magento setup:di:compile
rm -rf var/view_preprocessed/* var/cache/* var/page_cache/* pub/static/*
php -d memory_limit=-1 bin/magento setup:static-content:deploy en_US -f
php -d memory_limit=-1 bin/magento setup:static-content:deploy de_DE --theme=Magento/furny -f
php -d memory_limit=-1 bin/magento setup:static-content:deploy fr_FR --theme=Magento/furny -f
php -d memory_limit=-1 bin/magento setup:static-content:deploy da_DK --theme=Magento/furny -f
php -d memory_limit=-1 bin/magento setup:static-content:deploy sv_SE --theme=Magento/furny -f
php -d memory_limit=-1 bin/magento setup:static-content:deploy nl_NL --theme=Magento/furny -f
php -d memory_limit=-1 bin/magento dev:source-theme:deploy --theme=Magento/furny --locale=en_US
php -d memory_limit=-1 bin/magento dev:source-theme:deploy --theme=Magento/furny --locale=de_DE
php -d memory_limit=-1 bin/magento dev:source-theme:deploy --theme=Magento/furny --locale=fr_FR
php -d memory_limit=-1 bin/magento dev:source-theme:deploy --theme=Magento/furny --locale=da_DK
php -d memory_limit=-1 bin/magento dev:source-theme:deploy --theme=Magento/furny --locale=sv_SE
php -d memory_limit=-1 bin/magento dev:source-theme:deploy --theme=Magento/furny --locale=nl_NL
php bin/magento cache:flush
exit 0