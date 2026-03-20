import { useNavigate } from 'react-router-dom';
import permissionDenied from './img/403.svg';
import { Button } from 'antd';
import React from 'react';
import './styles/permissionDenied.less';
import { useSptIntl } from '@/lang';

export const PermissionDenied = () => {
    const navigate = useNavigate();
    const intl = useSptIntl();

    return (
        <div className="permission-denied-wrap">
            <div className="permission-denied-container">
                <div className="permission-denied-content">
                    <img
                        className="permission-denied-img"
                        src={permissionDenied}
                        alt="Server Error"
                    />
                    <div className="permission-denied-title">
                        {intl.getMessage('infra.downgrade_permission_denied_title') as string}
                    </div>
                    <div className="permission-denied-help-msg">
                        {intl.getMessage('infra.downgrade_permission_denied_help') as string}
                    </div>
                    <Button
                        className="permission-denied-button"
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
