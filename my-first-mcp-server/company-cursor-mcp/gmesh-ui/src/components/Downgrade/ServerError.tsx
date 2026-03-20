import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import serverError from './img/500.svg';
import './styles/serverError.less';
import { useSptIntl } from '@/lang';

export const ServerError = () => {
    const navigate = useNavigate();
    const intl = useSptIntl();

    return (
        <div className="server-error-container">
            <div className="server-error-content">
                <div className="server-error-wrap">
                    <img className="server-error-img" src={serverError} alt="Server Error" />
                    <div className="server-error-title">
                        {intl.getMessage('infra.downgrade_server_error_title') as string}
                    </div>
                    <div className="server-error-help-msg">
                        {intl.getMessage('infra.downgrade_server_error_help') as string}
                    </div>
                    <Button
                        className="server-error-button"
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
