import { ConfigLayout } from '@spotter/lowcode-config-common'
import type { ConfigLayoutProps } from '@spotter/lowcode-config-common';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { BasicConfig, SptTabWithBadgeModuleModel } from '../../model/schema';
import { cloneDeep } from 'lodash';
import DynamicForm from '../../../../ConfigCommon/src/StyleSchemaRender/SchemaRender';
import { TabWithBadgeConfig } from './TabWithBadgeConfig';


export const ModuleConfigForm = ({ moduleConfig, updatePageContent }: { moduleConfig: SptTabWithBadgeModuleModel, updatePageContent: (params: SptTabWithBadgeModuleModel) => void }) => {
  const [basic, setBasic] = useState<BasicConfig>()
  useEffect(() => {
    if (!basic) {
      const { content: { basic: curBasic } } = moduleConfig
      setBasic(curBasic)
    }
  }, [moduleConfig, basic?.props.customStyle])

  const configList: ConfigLayoutProps[] = useMemo(() => {
    if (!basic) {
      return [{ header: '111', children: "1111", styleConfiguration: '' }]
    }


    return [{
      header: 'TabWithBadge配置',
      children: <TabWithBadgeConfig config={cloneDeep(basic.attrs)} onChange={(config) => {
        basic.attrs = config
        updatePageContent({ ...moduleConfig, content: { ...moduleConfig.content, basic } })
      }} />,
      styleConfiguration: <DynamicForm
        styleChange={(newStyleProperties: CSSProperties) => {
          basic.props.customStyle = { ...basic.props.customStyle, ...newStyleProperties } as any
          updatePageContent({ ...moduleConfig, content: { ...moduleConfig.content, basic } })
        }}
        defaultStyle={basic?.props?.customStyle ?? {}}
      />
    }]
  }, [basic, basic?.props.customStyle])
  return <ConfigLayout childrenList={configList} />
}
