import React, { FC, HTMLAttributes } from 'react';
import classNames from 'classnames';
import { BrandName } from './BrandName';
import { BrandLogo } from './BrandLogo';
import './style/brand-full.less';

export interface BrandFullProps {
    containerProps?: HTMLAttributes<HTMLDivElement>;
    logoProps?: HTMLAttributes<HTMLDivElement>;
    nameProps?: HTMLAttributes<HTMLDivElement>;
}
export const BrandFull: FC<BrandFullProps> = ({ containerProps, logoProps, nameProps }) => (
    <div
        {...containerProps}
        className={classNames('brand-full-container', containerProps?.className)}
    >
        <BrandLogo
            {...logoProps}
            className={classNames('brand-full-container-logo', logoProps?.className)}
        />
        <BrandName {...nameProps} className={classNames(nameProps?.className)} />
    </div>
);
