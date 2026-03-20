
import { cloneDeep } from 'lodash'
import { FormInstance, Spin } from 'antd'
import { FC } from 'react'
import { Switch } from '../../src/common/Switch'
import { Selected } from '../../src/common/Selected'
import { EditableInput } from '../../src/common/EditableInput'
import { RenderComponentConfig, generatePropsJson, jsonMap } from './FunctionJsonSchema'

export * from './FunctionJsonSchema'

const renderFormItem: (componentJson: any, formItemNames: string[], formRef: FormInstance<any>, onChange: (cardInfo: any) => void, config: any) => any = (componentJson, formItemNames, formRef, onChange, config) => {
    if (!formItemNames || formItemNames?.length === 0) {
        return <Spin spinning={true}></Spin>
    }
    const switchNames = formItemNames.filter((name: string) => {
        return componentJson[name].format === 'checkbox'
    })
    const selectNams = formItemNames.filter((name: string) => {
        return componentJson[name].format === 'select'
    })
    const numberInput = formItemNames.filter((name: string) => {
        return componentJson[name].format === 'numberInput'
    })
    const editName = formItemNames.filter((name: string) => {
        return componentJson[name].format === 'editInput'
    })
    function generateEnumToOption(enumList: any[]) {
        const result: any = {}
        enumList?.forEach((item) => {
            result[item] = {
                text: item,
                value: item
            }
        })
        return result
    }
    return <div className='block'>
        <div className='grid grid-cols-2 gap-6'> {switchNames.map((name: string) => {
            const curAttrJson = componentJson[name]
            return <div style={{
                borderRadius:'8px',
                padding:'4px 14px',
                marginBottom:'12px',
                background:'rgb(230,247,255)'
            }} >
                <Switch
                    cardInfo={config}
                    formalParams={curAttrJson.formalParams}
                    initValue={config[name]}
                    onChange={onChange}
                    name={name}
                    formRef={formRef}
                />
            </div>
        })}
        </div>
        <div>
            <div> {selectNams.map((name: string) => {
                const curAttrJson = componentJson[name]
                return <div>
                    <Selected
                        cardInfo={config}
                        valueTypeEnum={generateEnumToOption(curAttrJson.enumvalue)}
                        name={name}
                        onChange={onChange}
                        formRef={formRef}
                    />
                </div>
            })}</div>
            <div className=''>
                {editName.map((name: string) => {
                    const curAttrJson = componentJson[name]
                    return <div className=''>
                        <EditableInput
                            cardInfo={config}
                            formalParams={curAttrJson.formalParams}
                            initValue={cloneDeep(config[name])}
                            onChange={onChange}
                            name={name}
                            formRef={formRef}
                        />
                    </div>
                })}
            </div>
        </div>
    </div>
}


export const ComponentJsonSchemaRender: FC<{ formRef: FormInstance<any>, onChange: (cardInfo: any) => void, config: any, renderComponentConfig: RenderComponentConfig }> = ({ formRef, onChange, config, renderComponentConfig }) => {
    const componentJson = generatePropsJson(jsonMap[renderComponentConfig])
    return <>{renderFormItem(componentJson, Object.keys(componentJson), formRef, onChange, config)}</>
}