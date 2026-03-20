import {
    getCurrentPlatformRegionCode,
    localCache,
    SPT_AMAZON_ASIN_SITE_KEY,
    PLATFORM_REGION_ENUM,
} from '@spotter/app-client-toolkit';

export const getAsinLink = (asin: string, region?: PLATFORM_REGION_ENUM) => {
    const currentRegion = region || getCurrentPlatformRegionCode();
    if (!currentRegion) return '';
    const amazonAsinUrlMap = localCache.get(SPT_AMAZON_ASIN_SITE_KEY) || {};
    const amazonAsinUrl = amazonAsinUrlMap?.[currentRegion?.toUpperCase()];
    return amazonAsinUrl?.endsWith('/') ? `${amazonAsinUrl}${asin}` : `${amazonAsinUrl}/${asin}`;
};
