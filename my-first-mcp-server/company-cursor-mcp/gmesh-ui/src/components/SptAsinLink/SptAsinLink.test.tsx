// 引入必要的库和组件
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SptAsinLink from './index';

describe('SptAsinLink', () => {
    it('renders the link with the correct href', () => {
        const asin = 'B08L8KC1J7';
        const { getByText } = render(<SptAsinLink asin={asin} />);

        const linkElement = getByText(asin);
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.getAttribute('href')).toBe(`https://www.amazon.com/dp/${asin}`);
    });
});
