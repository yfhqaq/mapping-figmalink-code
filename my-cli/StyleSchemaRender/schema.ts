export interface Property {
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

export interface Schema {
    type: string;
    properties: {
        [key: string]: Property;
    };
}

export const initialSchema: Schema = {
    type: "object",
    properties: {
        margin: {
            type: "object",
            description: "外边距",
            properties: {
                marginTop: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "上边距" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                marginRight: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "右边距" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                marginBottom: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "下边距" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                marginLeft: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "左边距" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
            },
        },
        padding: {
            type: "object",
            description: "内边距",
            properties: {
                paddingTop: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "上内边距" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                paddingRight: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "右内边距" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                paddingBottom: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "下内边距" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                paddingLeft: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "左内边距" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
            },
        },
        border: {
            type: "object",
            description: "边框",
            properties: {
                borderWidth: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "边框宽度" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                borderStyle: { type: "object", format: "select", properties: { value: { type: "string", enum: ["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"], default: undefined, description: "边框样式" } } },
                borderColor: { type: "object", format: "color", properties: { value: { type: "string", default: undefined, description: "边框颜色" } } },
                borderRadius: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "边框圆角" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
            },
        },
        borderLeft: {
            type: "object",
            description: "左边框",
            properties: {
                borderLeftWidth: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "左边框宽度" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                borderLeftStyle: { type: "object", format: "select", properties: { value: { type: "string", enum: ["none", "solid", "dashed", "dotted", "double", "groove", "ridge", "inset", "outset"], default: undefined, description: "左边框样式" } } },
                borderLeftColor: { type: "object", format: "color", properties: { value: { type: "string", default: undefined, description: "左边框颜色" } } },
                borderLeftRadius: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "左边框圆角" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
            },
        },
        background: {
            type: "object",
            description: "背景",
            properties: {
                backgroundColor: { type: "object", format: "color", properties: { value: { type: "string", default: undefined, description: "背景颜色" } } },
                backgroundImage: { type: "object", properties: { value: { type: "string", default: undefined, description: "背景图像" } } },
                backgroundSize: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "背景大小" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                backgroundRepeat: { type: "object", format: "select", properties: { value: { type: "string", enum: ["repeat", "no-repeat", "repeat-x", "repeat-y"], default: undefined, description: "背景重复" } } },
            },
        },
        font: {
            type: "object",
            description: "字体",
            properties: {
                fontColor: { type: "object", format: "color", properties: { value: { type: "string", default: undefined, description: "文字颜色" } } },
                fontSize: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "字体大小" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                fontWeight: { type: "object", format: "numberInput", properties: { value: { type: "string", default: undefined, description: "字体粗细" } } },
                fontStyle: { type: "object", format: "select", properties: { value: { type: "string", enum: ["normal", "italic", "oblique"], default: undefined, description: "字体样式" } } },
                fontFamily: { type: "object", format: "select", properties: { value: { type: "string", enum: ["Arial", "Helvetica", "Times New Roman", "Courier New"], default: undefined, description: "字体系列" } } },
            },
        },
        textAlign: {
            type: "object",
            format: "select",
            description: "文字对齐",
            properties: {
                textAlign: { type: "object", format: "select", properties: { value: { type: "string", enum: ["left", "center", "right", "justify"], default: undefined, description: "文字对齐" } } },
            },
        },
        display: {
            type: "object",
            format: "select",
            description: "元素布局",
            properties: {
                display: { type: "object", format: "select", properties: { value: { type: "string", enum: ["block", "flex", "inline-flex", "inline-block", "inline"], default: undefined, description: "元素布局" } } },
            },
        },
        position: {
            type: "object",
            format: "select",
            description: "定位方式",
            properties: {
                position: { type: "object", format: "select", properties: { value: { type: "string", enum: ["static", "relative", "absolute", "fixed", "sticky"], default: undefined, description: "定位方式" } } },
            },
        },
        relativePosition: {
            type: "object",
            description: "相对位置距离",
            properties: {
                top: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "距顶部距离" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                left: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "距左边距离" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                right: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "距右边距离" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
                bottom: { type: "object", format: "numberInput", properties: { value: { type: "number", default: undefined, description: "距底部距离" }, unit: { type: "string", enum: ["px", "em", "rem", "vh", "vw", "%"], default: "px" } } },
            },
        },
        opacity: {
            type: "object",
            description: "不透明度",
            properties: {
                opacity: {
                    type: "object", format: "numberInput", properties: {
                        value: { type: "number", default: 1, description: "不透明度" }
                    }
                },
            },
        },
        zIndex: {
            type: "object",
            description: "层叠顺序",
            properties: {
                zIndex: {
                    type: "object", format: "numberInput", properties: {
                        value: { type: "number", default: undefined, description: "层叠顺序" }
                    }
                },
            },
        },
        overflow: {
            type: "object",
            format: "select",
            description: "溢出处理",
            properties: {
                overflow: { type: "object", format: "select", properties: { value: { type: "string", enum: ["visible", "hidden", "scroll", "auto"], default: undefined, description: "溢出处理" } } },
            },
        },
    },
};
