import { FC } from "react";
import { ProForm } from "@ant-design/pro-components";
import { ComponentJsonSchemaRender, RenderComponentConfig } from "@spotter/lowcode-config-common";



export const TabWithBadgeConfig: FC<{ config: any, onChange: (buttonConfig: any) => void }> = ({ config, onChange }) => {
    const [formRef] = ProForm.useForm();
    return <ProForm
        form={formRef}
        submitter={false}
        initialValues={{ ...config }}
        onChange={() => {
            onChange({ ...config, ...formRef?.getFieldsValue() });
        }}
    >
        <div className="flex" style={{ flexFlow: 'wrap' }}>
            <ComponentJsonSchemaRender renderComponentConfig={RenderComponentConfig.TabWithBadge} formRef={formRef} onChange={onChange} config={config} ></ComponentJsonSchemaRender>
        </div>
    </ProForm>
}
