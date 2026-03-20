import { getAppBootData } from '@spotter/app-client-toolkit';
import { SpotterWarehouseApiSdk } from '@/api';
import { sptI18n } from '@spotter/i18n-sdk';
import { message } from 'antd';

export const WarehouseSdk = new SpotterWarehouseApiSdk({
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
