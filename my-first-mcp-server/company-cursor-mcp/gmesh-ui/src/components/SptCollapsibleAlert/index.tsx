import React from 'react';
import { Alert, AlertProps, Typography } from 'antd';
import { FC, ReactNode, useState } from 'react';

export interface SptCollapsibleAlertProps extends Omit<AlertProps, 'message' | 'action'> {
    // 折叠时的行数，超过此行数时显示展开按钮
    rows?: number;
    children?: ReactNode;
    description: ReactNode;
}

const SptCollapsibleAlert: FC<SptCollapsibleAlertProps> = ({
    rows = 1,
    children,
    description,
    ...props
}) => {
    const [show, setShow] = useState(false);
    const [showExpandBtn, setShowExpandBtn] = useState(false);
    return (
        <div>
            <Alert
                className="mt-16px"
                message={
                    <span>
                        {description}
                        <Typography.Paragraph
                            ellipsis={
                                show ? false : { rows, onEllipsis: () => setShowExpandBtn(true) }
                            }
                            className="!mb-0px"
                        >
                            {children}
                        </Typography.Paragraph>
                    </span>
                }
                action={
                    showExpandBtn ? (
                        <Typography.Link onClick={() => setShow(!show)}>
                            {!show ? '展开' : '折叠'}
                        </Typography.Link>
                    ) : null
                }
                {...props}
            />
        </div>
    );
};

export default SptCollapsibleAlert;
