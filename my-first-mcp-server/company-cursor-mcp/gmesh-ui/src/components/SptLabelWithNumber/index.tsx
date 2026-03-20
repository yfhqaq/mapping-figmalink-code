import { Badge } from 'antd';
import React from 'react';
import { FC } from 'react';
import './style/index.less';

export interface SptLabelWithNumberProps {
    /**
     * 文本内容
     */
    label?: React.ReactNode;
    /**
     * Badge组件Count数量
     */
    count?: number;
    /**
     * 控制Badge组件是否展示
     */
    showBadge?: boolean;
    /**
     * 高亮样式，可用于Tab场景下的高亮展示
     */
    active?: boolean;
    /**
     * 控制count为0的时候展示Badge徽标
     */
    showZero?: boolean;
}

const SptLabelWithNumber: FC<SptLabelWithNumberProps> = ({
    label,
    count = 0,
    showBadge = true,
    active = false,
    showZero = false,
}) => (
    <div className="spt-component-label-with-number">
        <div>{label}</div>
        {showBadge && count > 0 ? (
            <Badge
                count={count}
                showZero={showZero}
                color="#F0F5FF"
                style={{
                    marginLeft: '5px',
                    color: active ? 'var(--color-primary)' : 'rgba(0,0,0, 0.45)',
                }}
            />
        ) : null}
    </div>
);

export default SptLabelWithNumber;
