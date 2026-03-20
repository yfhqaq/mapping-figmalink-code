import { ConfigLayout } from '@spotter/lowcode-config-common'
import type { ConfigLayoutProps } from '@spotter/lowcode-config-common';
import { FC, useEffect, useMemo, useState } from 'react';
import { BasicConfig, ContainerModuleModel } from '../../model/schema';
import { ContainerConfig } from './ContainerSchema';

interface ModuleConfigFormProps {
  moduleConfig: ContainerModuleModel,
  updatePageContent: (params: ContainerModuleModel) => void
}

export const ModuleConfigForm: FC<ModuleConfigFormProps> = ({ moduleConfig, updatePageContent }) => {
  const [basic, setBasic] = useState<BasicConfig>()

  useEffect(() => {
    if (moduleConfig.key) {
      const { content: { basic: curBasic } } = { ...moduleConfig }
      setBasic(curBasic)
    }
  }, [moduleConfig, moduleConfig?.key])

  const configList: ConfigLayoutProps[] = useMemo(() => {
    if (!basic) {
      return [{ header: '111', children: "1111" }]
    }
    return [{
      header: 'Container配置',
      children: <ContainerConfig
        config={basic.attrs}
        onChange={(config) => {
          basic.attrs = config
          updatePageContent({ ...moduleConfig, content: { ...moduleConfig.content, basic } })
        }} />
    }]
  }, [basic])

  return <ConfigLayout childrenList={configList} />
}
