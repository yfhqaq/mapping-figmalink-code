import { ProForm, ProFormText } from "@ant-design/pro-components";
import { ContainerProps } from "../../../model/schema";
import { FC } from "react";

interface ContainerConfigProps {
  config: ContainerProps,
  onChange: (tableConfig: ContainerProps) => void
}

export const ContainerConfig: FC<ContainerConfigProps> = ({ config, onChange }) => {
  const [formRef] = ProForm.useForm();

  return <ProForm
    form={formRef}
    submitter={false}
    initialValues={config}
    onChange={() => {
      onChange({ ...config, ...formRef?.getFieldsValue() });
    }}
  >
    <ProFormText name="span" label="span" width="xl"></ProFormText>
    <ProFormText name="gutter" label="gutter" width="xl"></ProFormText>
  </ProForm>
}
