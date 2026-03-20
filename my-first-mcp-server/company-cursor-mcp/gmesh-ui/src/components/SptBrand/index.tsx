import React from 'react';
import { BrandFull, BrandFullProps } from './BrandFull';
import { BrandLogo } from './BrandLogo';
import { BrandName } from './BrandName';
import { BrandCopyright } from './BrandCopyright';

interface ComputedBrandComponent {
    Logo: typeof BrandLogo;
    Name: typeof BrandName;
    Copyright: typeof BrandCopyright;
}

const SptBrand: React.FC<BrandFullProps> & ComputedBrandComponent = ({ ...props }) => {
    return <BrandFull {...props} />;
};

SptBrand.Logo = BrandLogo;
SptBrand.Name = BrandName;
SptBrand.Copyright = BrandCopyright;

export default SptBrand;
