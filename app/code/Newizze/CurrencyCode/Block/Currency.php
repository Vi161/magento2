<?php

/**
 * Copyright (C) 2018  Newizze (Eldar Mavlikhanov)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @copyright   Copyright (c) 2018 Newizze (http://www.newizze.com)
 * @license     http://www.gnu.org/licenses/  GNU General Public License (Version 3)
 */

namespace Newizze\CurrencyCode\Block;

class Currency extends \Magento\Directory\Block\Currency
{
    /**
     * get Currency Symbol
     * @return mixed
     */
    public function getSymbol()
    {
        return $this->_storeManager->getStore()->getBaseCurrency()->getCurrencySymbol();
    }
}