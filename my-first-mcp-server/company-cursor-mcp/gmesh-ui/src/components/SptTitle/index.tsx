import React, { FC } from 'react';
import { SptComponentProvider } from '../Provider';
import classNames from 'classnames';
import { useStyles } from './style';

export interface SptTitleProps {
    /**
     * bigger: 20px
     * medium: 16px;
     * small: 14px;
     */
    size?: 'bigger' | 'medium' | 'small';
    className?: string;
    style?: React.CSSProperties;
    /**
     * normal: 400;
     * bold: 600;
     */
    weight?: 'normal' | 'bold';
    children?: React.ReactNode;
    hasColorBlock?: boolean;
    description?: string;
}

const SpotterTitleBase: FC<SptTitleProps> = ({
    children,
    className,
    size = 'medium',
    weight = 'bold',
    hasColorBlock = false,
    description = undefined,
    ...props
}) => {
    const { styles } = useStyles();
    return (
        <div className={classNames('spt-title-container', styles.container, className)}>
            <div
                className={classNames(
                    'spotter-title-container',
                    `spotter-title-size-${size}`,
                    `spotter-title-weight-${weight}`,
                )}
                {...props}
            >
                {hasColorBlock ? <span className="sptter-title-before-color-block"></span> : null}
                {children}
            </div>
            {description ? <span className="spotter-title-description">{description}</span> : null}
        </div>
    );
};

/**
 * 内部用标题组件，用于规范标题使用
 * @param props
 * @returns
 */
const SptTitle: FC<SptTitleProps> = (props) => {
    return (
        <SptComponentProvider>
            <SpotterTitleBase {...props} />
        </SptComponentProvider>
    );
};

export default SptTitle;
