import { CSSProperties } from 'react';
import { Property, Schema, initialSchema } from './schema';
import { isNil } from '@ant-design/pro-components';
import { cloneDeep } from 'lodash';
export enum restoreEnum {
    parentKey,
    childKey
}
// 解析CSS值和单位的函数
export const parseCSSValue = (value: string): { value: number; unit: string } => {
    const match = value.match(/^(\d+)(px|em|rem|vh|vw|%)$/);
    return match
        ? { value: parseFloat(match[1]), unit: match[2] }
        : { value: parseFloat(value), unit: '' };
};


// 定义schemaMapping的类型
export const extractSchemaMappings = (schema: Schema) => {
    const mappings: { [key: string]: { [key: string]: string } } = {
        numberInput: {},
        select: {},
        color: {},
    };

    const extractMappings = (sourceSchema: Schema, parentKey: string) => {
        Object.keys(sourceSchema.properties).forEach((key) => {
            const property = sourceSchema.properties[key];
            if (property.format) {
                mappings[property.format][key] = parentKey;
            }
            if (property.properties) {
                extractMappings(property as Schema, key);
            }
        });
    };

    extractMappings(schema, '');

    return mappings;
};

export const analysisStyle = ({ schemaMapping, schema, defaultStyle }: {
    schemaMapping: any, schema: Schema, defaultStyle: CSSProperties
}) => {
    const updatedSchema = cloneDeep(schema);
    const { color, numberInput, select } = schemaMapping as any
    if (!numberInput) return updatedSchema
    const numberKeys = Object.keys(numberInput)
    const colorKeys = Object.keys(color)
    const selectKeys = Object.keys(select)
    Object.entries(defaultStyle).forEach(([key, value]) => {
        if (!value) return
        if (numberKeys.includes(key)) {
            const schemaKey = numberKeys.find(k => k.toLowerCase() === key.toLowerCase());
            if (schemaKey) {
                const { value: parsedValue, unit } = parseCSSValue(value as string);
                const parentKey = numberInput[schemaKey] as unknown as string;
                if (updatedSchema.properties[parentKey]?.properties?.[schemaKey]) {
                    //@ts-ignore
                    updatedSchema.properties[parentKey].properties[schemaKey].properties!.value.default = parsedValue;
                    if (unit && updatedSchema?.properties?.[parentKey]?.properties?.[schemaKey]?.properties?.unit) {
                        //@ts-ignore
                        updatedSchema.properties[parentKey].properties[schemaKey].properties!.unit.default = unit;
                    }
                }
            }
        } else if (colorKeys.includes(key)) {
            const schemaKey = colorKeys.find(k => k.toLowerCase() === key.toLowerCase()) as string;
            const parentKey = color[schemaKey] as unknown as string;
            //@ts-ignore
            (updatedSchema.properties[parentKey].properties[schemaKey].properties!.value as Property).default = value as string;
        } else {
            const schemaKey = selectKeys.find(k => k.toLowerCase() === key.toLowerCase()) as string;
            const parentKey = select[schemaKey] as unknown as string;
            //@ts-ignore
            updatedSchema.properties[parentKey].properties[schemaKey].properties!.value.default = value;
        }

    });
    return updatedSchema
}

export const analysisCurStyleProperty: (schemaMapping: any, changedValues: any, curStyle: CSSProperties) => CSSProperties = (schemaMapping, changedValues, curStyle) => {
    const { numberInput } = schemaMapping
    const propertyValues = Object.values(changedValues)[0]
    const property = Object.keys(propertyValues as any)[0]
    const properValues = Object.values(propertyValues as any)[0] as {
        [key: string]: Property;
    }
    const keyType = Object.keys(properValues as any)[0]
    let curPropertyStyle = {}
    if (Object.keys(numberInput).includes(property)) {
        if (!isNil(curStyle[property as keyof typeof curStyle])) {
            const { value: parsedValue, unit } = parseCSSValue(curStyle[property as keyof typeof curStyle] as string);
            if (keyType === 'unit') {
                curPropertyStyle = {
                    [property]: `${parsedValue}${properValues[keyType]}`
                }
            } else {
                curPropertyStyle = {
                    [property]: `${properValues[keyType]}${unit}`
                }
            }
        } else {
            if (keyType === 'unit') {
                curPropertyStyle = {
                    [property]: `${0}${properValues[keyType]}`
                }
            } else if (keyType === 'value' && initialSchema.properties[Object.keys(changedValues)[0]]?.properties?.[property]?.properties?.unit) {
                curPropertyStyle = {
                    [property]: `${properValues[keyType]}px`
                }
            } else {
                curPropertyStyle = {
                    [property]: `${properValues[keyType]}`
                }
            }
        }
    } else {
        curPropertyStyle = {
            [property]: properValues[keyType]
        }
    }
    return curPropertyStyle
}

export const getLatestStyle: (curStyle: CSSProperties, restoreProperty: keyof CSSProperties, restoretype: restoreEnum, schema: Property) => { latestStyle: CSSProperties, restoreKeys: CSSProperties[] } = (curStyle, restoreProperty, restoretype, schema) => {
    if (restoretype === restoreEnum.childKey) {
        return { latestStyle: { ...curStyle, [restoreProperty]: undefined }, restoreKeys: [restoreProperty] }
    } else {
        let defaultStyles: CSSProperties = {}
        const keys = Object.keys(schema.properties?.[restoreProperty].properties as object)
        keys.forEach((styleKey) => {
            defaultStyles = { ...defaultStyles, [styleKey]: undefined }
        })
        return { latestStyle: { ...curStyle, ...defaultStyles }, restoreKeys: [...keys] as any }
    }
}