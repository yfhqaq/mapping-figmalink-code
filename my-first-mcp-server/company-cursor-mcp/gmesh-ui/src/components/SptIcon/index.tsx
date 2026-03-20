import React, { FC, CSSProperties } from 'react';
import classNames from 'classnames';
import './style/iconfont/index.less';

export interface SptIconProps {
    type: string;
    size?: CSSProperties['fontSize'];
    color?: string;
    className?: string;
}

const SptIcon: FC<SptIconProps> = ({ type, size, color, className }) => (
    <i
        style={{
            fontSize: size,
            lineHeight: size ?? '16px',
            color,
        }}
        className={classNames('sptfont', type, className)}
    />
);

export default SptIcon;
