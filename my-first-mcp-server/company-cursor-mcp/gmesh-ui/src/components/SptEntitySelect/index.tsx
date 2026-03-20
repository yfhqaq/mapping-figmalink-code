import React from 'react';
import CompanySelect, { CompanyParamsType, CompanyResponseType } from './components/Company';
import SupplierSelect, { SupplierParamsType, SupplierResponseType } from './components/Supplier';
import StoreSelect, { StoreParamsType, StoreResponseType } from './components/Store';
import SvcAccount, { SvcAccountResponseType } from './components/SvcAccount';
import { BUSINESS_TYPE, MakePartial } from './components/types';
import { SelectBaseProps } from './components/SelectBase';
import VendorCode, { VendorCodeParamsType, VendorCodeResponseType } from './components/VendorCode';

export interface SptEntitySelectProps<T = any, U = any>
    extends MakePartial<Omit<SelectBaseProps<T, U>, 'request'>, 'labelName' | 'valueName'> {
    businessType: BUSINESS_TYPE;
}

/**
 * 业务下拉组件封装，合并所有业务类型的下拉组件，通过businessType区分
 * @param param0
 * @returns
 */
function SptEntitySelect({
    businessType,
    ...props
}: SptEntitySelectProps<
    CompanyParamsType & StoreParamsType & VendorCodeParamsType & SupplierParamsType,
    SvcAccountResponseType &
        CompanyResponseType &
        StoreResponseType &
        VendorCodeResponseType &
        SupplierResponseType
>) {
    const getEntityComponent = () => {
        if (businessType === 'company') {
            return <CompanySelect {...(props as any)} />;
        }

        if (businessType === 'store') {
            return <StoreSelect {...(props as any)} />;
        }

        if (businessType === 'svcAccount') {
            return <SvcAccount {...(props as any)} />;
        }

        if (businessType === 'vendorCode') {
            return <VendorCode {...(props as any)} />;
        }

        if (businessType === 'supplier') {
            return <SupplierSelect {...(props as any)} />;
        }
    };

    return getEntityComponent();
}

export type MergedSptEntitySelectProps = typeof SptEntitySelect & {
    displayName?: string;
    Company: typeof CompanySelect;
    Store: typeof StoreSelect;
    SvcAccount: typeof SvcAccount;
    VendorCode: typeof VendorCode;
    Supplier: typeof SupplierSelect;
};

/**
 * 业务下拉组件基础方法，合并所有业务类型的下拉组件
 */
const MergedSptEntitySelect = SptEntitySelect as MergedSptEntitySelectProps;
MergedSptEntitySelect.Company = CompanySelect;
MergedSptEntitySelect.Store = StoreSelect;
MergedSptEntitySelect.SvcAccount = SvcAccount;
MergedSptEntitySelect.VendorCode = VendorCode;
MergedSptEntitySelect.Supplier = SupplierSelect;

export default MergedSptEntitySelect;
