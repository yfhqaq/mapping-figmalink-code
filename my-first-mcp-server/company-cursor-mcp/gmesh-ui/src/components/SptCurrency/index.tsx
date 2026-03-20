import { EMPTY_SET, formatUsAmount, IdentifierType, USD } from '@spotter/app-client-toolkit';
import classNames from 'classnames';
import React, { FC } from 'react';
import './style/index.less';

export type SptCurrencyProps = {
    amount?: IdentifierType;
    code?: string;
    className?: string;
};

/**
 * 金额展示组件
 * @param param0
 * @returns
 */
const SptCurrency: FC<SptCurrencyProps> = ({ amount, code = USD, className }) => (
    <div className={classNames('spt-currency-container', className)}>
        <span className="spt-currency-main-text">{formatUsAmount(amount)}</span>
        {!EMPTY_SET.has(amount) && <span className="spt-currency-sub-text">{code}</span>}
    </div>
);

export default SptCurrency;
