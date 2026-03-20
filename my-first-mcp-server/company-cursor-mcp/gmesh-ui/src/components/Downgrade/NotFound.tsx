import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import notFound from './img/404.svg';
import './styles/notFound.less';
import { useSptIntl } from '@/lang';

/**
 * 应用无法匹配到浏览器当前路由时降级页面
 * @param param1
 * @returns
 */
export const NotFound = () => {
    const navigate = useNavigate();
    const intl = useSptIntl();
    return (
        <div className="not-found-wrapper">
            <div className="not-found-inner">
                <div className="not-found-inner-second">
                    <img className="not-found-img" src={notFound} alt="Not Found" />
                    <div className="not-found-title">
                        {intl.getMessage('infra.downgrade_not_found_title') as string}
                    </div>
                    <div className="not-found-help">
                        {intl.getMessage('infra.downgrade_not_found_help') as string}
                    </div>
                    <Button
                        className="not-found-back-home-button"
                        type="primary"
                        onClick={() => {
                            navigate('/');
                        }}
                    >
                        {intl.getMessage('infra.back_home') as string}
                    </Button>
                </div>
            </div>
        </div>
    );
};
