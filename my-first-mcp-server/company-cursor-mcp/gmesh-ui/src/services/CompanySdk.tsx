import { SpotterSupplierApiSdk } from '@/api';
import { getAppBootData } from '@spotter/app-client-toolkit';
import { message } from 'antd';
import { sptI18n } from '@spotter/i18n-sdk';

export const companySdk = new SpotterSupplierApiSdk({
    context: new URL(getAppBootData().appApiUrl),
    res: {
        onAuthError: (error) => {
            console.error(error.data);
        },
        onOtherError: (error) => {
            message.error((sptI18n(error?.data?.msg) as string) ?? error?.data?.msg?.defaultValue);
            console.error(error);
        },
    },
});
