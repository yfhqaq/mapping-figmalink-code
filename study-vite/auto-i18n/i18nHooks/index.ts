import { useSptTranslation } from '@spotter/i18n-sdk';
import { useCallback } from 'react';
import trans from '../i18n_source/trans';
export function useSt() {
    const { t } = useSptTranslation();
    return useCallback(
        (key: keyof typeof trans, options = {}) => t(key, { defaultValue: trans[key], ...options }),
        [t]
    );
}
