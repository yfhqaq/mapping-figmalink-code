import React from 'react';
import { PLATFORM_REGION_ENUM } from '@spotter/app-client-toolkit';
import SptLink, { SptLinkType } from '../SptLink';
import { SptComponentProvider } from '../Provider';
import { getAsinLink } from './utils';

export interface SptAsinLinkProps {
    type?: SptLinkType;
    asin: string;
    region?: PLATFORM_REGION_ENUM;
}

/**
 * 业务组件：跳转亚马逊多站点ASIN
 * https://www.amazon.com/dp/{asin}
 * @param param0
 * @returns
 */
const SptAsinLink: React.FC<SptAsinLinkProps> = ({ type = 'new', asin, region }) => {
    const link = getAsinLink(asin, region);
    return (
        <SptComponentProvider>
            <span>
                {asin ? (
                    <SptLink to={link} type={type}>
                        {asin}
                    </SptLink>
                ) : (
                    '-'
                )}
            </span>
        </SptComponentProvider>
    );
};

export default SptAsinLink;
