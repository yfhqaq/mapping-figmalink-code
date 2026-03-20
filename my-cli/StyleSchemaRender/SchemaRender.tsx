import React, { CSSProperties, useEffect, useState } from 'react';
import { Form, Input, Select, Row, Col, Collapse, Button } from 'antd';
import { SketchPicker } from 'react-color';
import { initialSchema } from './schema';
import { analysisCurStyleProperty, analysisStyle, extractSchemaMappings, getLatestStyle, restoreEnum } from './utils';




const { Option } = Select;
const { Panel } = Collapse;

interface Property {
  type: string;
  default?: string | number;
  description?: string;
  enum?: string[];
  format?: string;
  minimum?: number;
  maximum?: number;
  properties?: {
    [key: string]: Property;
  };
}

interface Schema {
  type: string;
  properties: {
    [key: string]: Property;
  };
}

const judgeDisabled: (schema: Property, key: string, curStyle: CSSProperties) => boolean = (schema, key, curStyle) => {
  const keys = Object.keys(schema?.properties?.[key].properties as object)
  if (keys.some((k) => { return curStyle[k as keyof typeof curStyle] !== undefined })) {
    return false
  }
  return true
}

const renderFormItem = (
  key: string,
  subKey: string,
  property: Property,
  formData: Record<string, any>,
  handleChange: (changedValues: any, allValues: any) => void
) => {

  const initialValue = formData[key]?.[subKey]?.value || property.properties?.value?.default || property.default;
  if (property.format === 'color') {
    return (
      <SketchPicker
        width='150px'
        color={initialValue}
        onChangeComplete={(color) => handleChange({ [key]: { [subKey]: { value: color.hex } } }, { ...formData, [key]: { ...formData[key], [subKey]: { value: color.hex } } })}
      />
    );
  }

  if (property.format === 'select') {
    return (
      <Select defaultValue={initialValue}>
        {property?.properties?.value?.enum?.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    );
  }

  if (property.format === 'numberInput') {
    return <Input style={{ background: 'white' }} type="number" defaultValue={initialValue} />;
  }

  return <Input style={{ background: 'white' }} defaultValue={initialValue} />;
};

interface DynamicFormProps {
  defaultStyle: CSSProperties;
  styleChange: (newStyle: CSSProperties) => void
}
const DynamicForm: React.FC<DynamicFormProps> = ({ defaultStyle, styleChange }) => {
  const [styleFormRef] = Form.useForm();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [schema, setSchema] = useState<Schema>(initialSchema);
  const [curStyle, setCurStyle] = useState<CSSProperties>({})
  const [schemaMapping, setSchemaMapping] = useState<any>({})
  const updateSchema = (changedValues: any) => {
    const curProperties = analysisCurStyleProperty(schemaMapping, changedValues, curStyle)
    styleChange({ ...curStyle, ...curProperties })
  };
  const handleChange = (changedValues: any, allValues: any) => {
    setFormData(allValues);
    updateSchema(changedValues);
  };


  useEffect(() => {
    setSchemaMapping(extractSchemaMappings(schema))
  }, [])
  useEffect(() => {
    const updatedSchema = analysisStyle({ defaultStyle, schemaMapping, schema: initialSchema })
    setSchema(updatedSchema);
    setCurStyle(defaultStyle);
  }, [defaultStyle, schemaMapping, styleFormRef]);
  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <Form
        form={styleFormRef}
        layout="vertical"
        onValuesChange={(changedValues, allValues) => handleChange(changedValues, allValues)}
      >
        <Collapse>
          {schema.properties && Object.keys(schema.properties)?.map((key: any) => (
            <Panel header={<div className='flex justify-between'><div>{schema.properties[key]?.description}</div><Button disabled={
              judgeDisabled(schema, key, curStyle)
            } size='small' onClick={(event) => {
              event.stopPropagation()
              const { latestStyle, restoreKeys } = getLatestStyle(curStyle, key, restoreEnum.parentKey, schema);
              restoreKeys.forEach((childKey) => {
                styleFormRef.setFieldsValue({
                  [key]: {
                    [childKey as any]: {
                      value: undefined,
                      unit: undefined
                    }
                  }
                });
              });
              styleChange(latestStyle);
              setCurStyle(latestStyle);
            }}>恢复默认</Button> </div>} key={key}>
              {schema.properties[key].properties && Object.keys(schema.properties[key].properties!)?.map((subKey: any) => (
                <Row key={subKey} gutter={16}>
                  <Col span={24}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', background: 'rgb(230,247,255)', border: '1px solid rgb(145,213,255)', borderRadius: '8px', padding: '4px 8px 0px 8px', flexWrap: 'wrap' }}>
                      <Form.Item
                        name={[key, subKey, "value"]}
                        label={schema.properties[key].properties![subKey].properties ? schema.properties[key].properties![subKey].properties!.value?.description : schema.properties[key].properties![subKey]?.description}
                        rules={[{ required: false }]}
                        style={{ flex: 1 }}
                      >
                        {renderFormItem(key, subKey, schema.properties[key].properties![subKey], formData, handleChange)}
                      </Form.Item>
                      {schema.properties[key].properties![subKey].properties?.unit && (
                        <Form.Item
                          name={[key, subKey, "unit"]}
                          label={`${schema.properties[key].properties![subKey].properties!.unit?.description || '单位'}`}
                          rules={[{ required: false }]}
                          style={{ width: '70px', marginLeft: '8px' }}
                        >
                          <Select defaultValue={schema.properties[key].properties![subKey].properties!.unit.default} disabled={schema.properties[key].properties![subKey].properties!.value.default === undefined} style={{ background: 'white' }}>
                            {schema.properties[key].properties![subKey].properties!.unit?.enum?.map((option) => (
                              <Option key={option} value={option}>
                                {option}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )}
                      <div className='mb-8px w-100% flex justify-end'><Button disabled={schema.properties[key].properties![subKey].properties!.value.default === undefined} style={{ marginLeft: '8px', justifySelf: 'justify-end' }} size='small' onClick={(event) => {
                        event.stopPropagation()
                        const { latestStyle, restoreKeys } = getLatestStyle(curStyle, subKey, restoreEnum.childKey, schema);
                        restoreKeys.forEach((childKey) => {
                          styleFormRef.setFieldsValue({
                            [key]: {
                              [childKey as any]: {
                                value: undefined,
                                unit: undefined
                              }
                            }
                          });
                        });
                        styleChange(latestStyle);
                        setCurStyle(latestStyle);
                      }}>恢复默认</Button></div>
                    </div>

                  </Col>
                </Row>
              ))}

            </Panel>
          ))}
        </Collapse>
      </Form>
    </div>
  )
};

export default DynamicForm;
