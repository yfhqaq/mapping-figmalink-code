import React, { FC } from 'react';
import { BrandFull } from './BrandFull';
import { Divider } from 'antd';
import './style/brand-copyright.less';

export const BrandCopyright: FC = () => (
    <div className="brand-copyright-container">
        <div className="brand-copyright-container-logo">
            <span className="brand-copyright-container-logo-pow">Powered By</span>
            <BrandFull
                logoProps={{ className: 'brand-copyright-container-logo-icon' }}
                nameProps={{
                    className: 'brand-copyright-container-logo-name',
                }}
            />
        </div>
        <span className="brand-copyright-container-copyright">
            Copyright © Since 2022 Spotterio.com, Inc. and its affiliates. All Rights Reserved.
            <Divider type="vertical" />
            <a
                className="brand-copyright-container-copyright-link"
                target="_blank"
                rel="noopener noreferrer"
                href="https://beian.miit.gov.cn"
            >
                粤ICP备2022005977号
            </a>
        </span>
    </div>
);
