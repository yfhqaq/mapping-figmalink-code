import { FC } from 'react';
import { SptComponentProvider } from '../Provider';
import React from 'react';
import { useStyles } from './style';
import classNames from 'classnames';
import { Space, SpaceProps } from 'antd';

export interface SptFooterToolbarProps extends SpaceProps {
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
    placeholder?: boolean;
}

/**
 * Pro-components FooterToolbar的封装，解决高度塌陷问题
 * @param param
 * @returns
 */
const SptFooterToolbar: FC<SptFooterToolbarProps> = ({
    children,
    className,
    style,
    placeholder,
    ...spaceProps
}) => {
    const { styles } = useStyles();

    return (
        <SptComponentProvider>
            <div className={classNames(styles.container, className)} style={style}>
                <Space {...spaceProps}>{children}</Space>
            </div>
            {placeholder && <div className={styles.placeholder} />}
        </SptComponentProvider>
    );
};

export default SptFooterToolbar;
