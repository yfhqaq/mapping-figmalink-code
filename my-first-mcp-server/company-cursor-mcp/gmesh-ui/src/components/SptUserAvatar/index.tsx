import { Avatar, Spin } from 'antd';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { SptComponentProvider } from '../Provider';

export interface SptUserAvatarProps {
    /**
     * 最长文字展示长度
     */
    maxNameLength?: number;
    /**
     * 长宽大小设置
     */
    size?:
        | number
        | {
              height: number;
              width: number;
          };
    /**
     * 字体大小设置
     */
    fontSize?: number | string;
    /**
     * 名称
     */
    name?: string;
    /**
     * 加载状态
     */
    loading?: boolean;
    style?: React.CSSProperties;
}

const UserAvatarBase: React.FC<SptUserAvatarProps> = ({
    maxNameLength = 1,
    size = 32,
    fontSize,
    name,
    loading,
    style,
}) => {
    return (
        <Avatar
            className="bg-primary-500"
            style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--color-primary)',
                width: typeof size === 'number' ? size : size.width,
                height: typeof size === 'number' ? size : size.height,
                fontSize:
                    fontSize ?? Math.max(14, (typeof size === 'number' ? size : size.height) / 3),
                ...style,
            }}
            gap={16}
        >
            {loading ? (
                <Spin
                    indicator={<LoadingOutlined />}
                    spinning
                    style={{ color: '#fff', display: 'flex', alignItems: 'center' }}
                    size="small"
                />
            ) : (
                name?.slice(0, Math.min(name?.length ?? Number.MAX_SAFE_INTEGER, maxNameLength))
            )}
        </Avatar>
    );
};

const SptUserAvatar: React.FC<SptUserAvatarProps> = ({ ...props }) => {
    return (
        <SptComponentProvider>
            <UserAvatarBase {...props} />
        </SptComponentProvider>
    );
};

export default SptUserAvatar;
