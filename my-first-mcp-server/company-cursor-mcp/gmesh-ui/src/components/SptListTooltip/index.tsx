import { DEFAULT_EMPTY_VALUE } from '@spotter/app-client-toolkit';
import { Tooltip, Typography } from 'antd';
import React, { FC } from 'react';
import { SptComponentProvider } from '../Provider';
import './style/index.less';
import { AbstractTooltipProps } from 'antd/es/tooltip';

const { Link } = Typography;

export interface SptListTooltipProps extends AbstractTooltipProps {
    list?: React.ReactNode[];
    text?: string;
}

const SptListTooltip: FC<SptListTooltipProps> = ({ list, text, ...props }) => {
    return (
        <SptComponentProvider>
            {list ? (
                <Tooltip
                    placement="right"
                    title={
                        <ul className="spt-list-tooltip-ul">
                            {list?.map((item, index) => (
                                <li key={index}>
                                    <span className="spt-list-tooltip-ul-marker">•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    }
                    {...props}
                >
                    <Link>{text ?? `${list?.length}个`}</Link>
                </Tooltip>
            ) : (
                <span>{DEFAULT_EMPTY_VALUE}</span>
            )}
        </SptComponentProvider>
    );
};

export default SptListTooltip;
