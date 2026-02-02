# Mapping MVP (Code Connect style)

This is a minimal, manual mapping setup using Code Connect-style files.
It is intended to produce LLM context without publishing to Figma.

What this contains:
- Placeholder React components for Table and Upload.
- Code Connect-style mapping files for those components.
- A single context bundle file for LLM ingestion.

You can replace the placeholder components later with your real library.

ComponentId cache (optional but recommended):
- `cache/component-index.json` stores a local lookup table from Figma componentId
  (and componentSetId) to component names and file keys.
- Populate it once per UX library file so matching does not require fetching the
  whole component registry every time.

Composite mapping template:
- `docs/composite-mapping-template.md` provides a reusable template for
  "many UX components -> one code component" mappings.


连接 React 组件  https://developers.figma.com/docs/code-connect/react/
本指南将帮助您使用 Code Connect 将 React（或 React Native）组件与 Figma 组件连接起来。Code Connect for React 既可以作为独立实现，也可以与现有的Storybook文件集成，从而方便地并行维护这两个系统。

重要提示： Code Connect 文件不会被执行。虽然它们是使用代码库中的真实组件编写的，但 Figma CLI 本质上会将代码片段视为字符串。这意味着，例如，您可以直接使用钩子函数而无需模拟数据。

figma.connect然而，这也意味着，示例代码中的逻辑运算符（例如三元运算符或条件语句）将直接输出，而不是执行后显示结果。例如，您无法在 for 循环中动态构造函数调用。

如果您由于 API 中的此限制而无法执行某些操作，我们非常希望听到您的反馈。

动态代码片段
如果您已完成Code Connect 入门指南，那么在开发模式下检查该组件的实例时，您应该可以看到一个已连接的代码片段。但是，该代码片段尚未反映完整的设计。

为了确保关联的代码片段能够准确反映设计，您需要使用属性映射。这使您能够将设计中的特定属性链接到代码中的属性。在大多数情况下，设计属性和代码属性并非一一对应，因此我们需要进行配置，以确保在开发模式下显示正确的代码。

以下是一个带有label、disabled和type属性的按钮的简单示例。

import figma from '@figma/code-connect/react'

figma.connect(Button, 'https://...', {
  props: {
    label: figma.string('Text Content'),
    disabled: figma.boolean('Disabled'),
    type: figma.enum('Type', {
      Primary: 'primary',
      Secondary: 'secondary',
    }),
  },
  example: ({ disabled, label, type }) => {
    return (
      <Button disabled={disabled} type={type}>
        {label}
      </Button>
    )
  },
})

进口figma​
此figma导入包包含用于将各种属性从设计映射到代码的辅助函数。它们既适用于 Figma 和代码之间仅名称不同的简单映射，也适用于类型不同的更复杂映射。有关所有现有的 Code Connect 辅助函数以及如何使用它们连接 Figma 和代码，请参阅以下参考文档。

figma.connect
figma.connect()具有两个用于连接组件的签名。

// connect a component in code to a Figma component
figma.connect(Button, "https://...")

// connect a Figma component to a native element
figma.connect("https://...")

如果您只想渲染一个 HTML 标签而不是 React 组件，则第二个选项很有用。

第一个参数用于确定组件在代码中的位置，以便为组件生成导入语句。如果您只想渲染类似 ` button<div>` 标签的内容，则不需要此参数。例如：

figma.connect("https://...", {
  example: () => <button>click me</button>
})

字符串
字符串是 Figma 到代码之间最容易映射的值。调用时，figma.string将要引用的 Figma 属性名称作为参数即可。这对于按钮标签、标题、工具提示等非常有用。

figma.string('Title')

布尔值
布尔值的工作方式与字符串类似。但是，Code Connect 还提供了辅助函数，用于将 Figma 中的布尔值映射到代码中更复杂的类型。例如，您可能希望将 Figma 中的布尔值映射到代码中特定子图层的存在性。除了映射布尔属性之外，Code figma.booleanConnect 还可以用于映射 Figma 中的布尔 Variant。布尔 Variant 是一种只有两个选项的 Variant，选项分别为“是”/“否”、“真”/“假”或“开”/“关”。figma.boolean这些值会被归一化为 0true和 1 false。

// simple mapping of boolean from figma to code
figma.boolean('Has Icon')

// map a boolean value to one of two options of any type
figma.boolean('Has Icon', {
  true: <Icon />,
  false: <Spacer />,
})

在某些情况下，您可能只想在某个属性值与 Figma 中的某个值匹配时才渲染该属性。您可以通过传递部分映射对象或将该值设置为undefined.

// Don't render the prop if 'Has label' in figma is `false`
figma.boolean('Has label', {
  true: figma.string('Label'),
  false: undefined,
})

枚举
在 Figma 中，变体（或枚举）通常用于控制组件的外观和风格，这些组件需要比简单的布尔切换更复杂的选项。变体属性在 Figma 中始终是字符串，但它们可以在代码中映射到任何类型。第一个参数是 Figma 中变体的名称，第二个参数是值映射。此对象中的键应与 Figma 中该变体的不同选项相匹配，而值则是您希望输出的任何内容。

// maps the 'Options' variant in Figma to enum values in code
figma.enum('Options', {
  'Option 1': Option.first,
  'Option 2': Option.second,
})

// maps the 'Options' variant in Figma to sub-component values in code
figma.enum('Options', {
  'Option 1': <Icon />,
  'Option 2': <IconButton />,
})

// result is true for disabled variants otherwise undefined
figma.enum('Variant', { Disabled: true })

// enums mappings can be used to show a component based on a Figma variant
figma.connect(Modal, 'https://...', {
  props: {
    cancelButton: figma.enum('Type', {
      Cancellable: <CancelButton />,
    }),
    // ...
  },
  example: ({ cancelButton }) => {
    return (
      <Modal>
        <Title>Title</Title>
        <Content>Some content</Content>
        {cancelButton}
      </Modal>
    )
  },
})


映射对象figma.enum以及允许嵌套引用，例如，figma.boolean如果您想有条件地渲染嵌套实例，这将非常有用。

// maps the 'Options' variant in Figma to enum values in code
figma.enum('Type', {
  WithIcon: figma.instance('Icon'),
  WithoutIcon: undefined,
})

与此相反figma.boolean，对于，值不会被规范化figma.enum。您始终需要将精确的字面值传递给映射对象。

// These two are equivalent for a variant with the options "Yes" and "No"
disabled: figma.enum("Boolean Variant", {
  Yes: // ...
  No: // ...
})
disabled: figma.boolean("Boolean Variant", {
  true: // ...
  false: // ...
})


实例
“实例”是 Figma 中用于指代嵌套组件引用的术语。例如，如果一个组件Button包含另一个组件Icon作为嵌套组件，我们就称该Icon嵌套组件为实例。在 Figma 中，实例可以是属性，例如组件的输入（类似于代码中的渲染属性）。就像我们可以将 Figma 中的布尔值、枚举和字符串映射到代码一样，我们也可以将它们映射到实例属性。

为了确保实例属性在 Code Connect 中发挥最大效用，我们建议您为所有预期会用作给定属性值的常用组件实现 Code Connect。开发模式会自动将与属性匹配的实例代码填充到引用组件的连接代码片段示例中。

请看以下示例：

// maps an instance-swap property from Figma
figma.instance('PropName')

返回值figma.instance是一个 JSX 组件，可以在你的示例中像使用代码库中的典型 JSX 组件属性一样使用它。

figma.connect(Button, 'https://...', {
  props: {
    icon: figma.instance('Icon'),
  },
  example: ({ icon }) => {
    return <Button icon={icon}>Instance prop Example</Button>
  },
})

然后，您应该单独调用一个figma.connect函数，将 Icon 组件与嵌套的 Figma 组件连接起来。请确保连接的是该实例的底层组件，而不是实例本身。

figma.connect(Icon32Add, 'https://...')

实例子项
在 Figma 中，组件通常会有未绑定实例交换属性的子实例。与 `<component>` 类似figma.instance，我们可以使用 `<component>` 来渲染这些嵌套实例的代码片段figma.children。此辅助函数以父组件中实例层的名称作为参数，而不是 Figma 属性名称。

为了说明这一点，请考虑组件中的层级结构与该组件的实例之间的关系：

Button (Component)
  Icon (Instance)

在前面的示例中，“Icon”是图层的原始名称，也是您应该传递给它的值figma.children()。

Button (Instance)
  RenamedIcon (Instance)

在前一个例子中，实例图层被重命名了。重命名图层不会破坏映射，因为在这种情况下，我们没有使用图层的名称。

注意：嵌套实例也必须单独连接。

组件集中不同变体的图层名称可能不同。为确保组件（按钮）可以为所有变体渲染嵌套实例（图标），您必须使用通配符选项figma.children("*")，或者确保表示实例（图标）的图层名称在组件集（按钮）的所有变体中保持一致。

// map one child instance with the layer name "Tab"
figma.children('Tab')

// map multiple child instances by their layer names to a single prop
figma.children(['Tab 1', 'Tab 2'])


外卡赛
figma.children()可以使用单个通配符“*”来匹配名称的部分内容或渲染任何嵌套子项。通配符不能与数组参数一起使用。匹配区分大小写。

// map any (all) child instances
figma.children('*')

// map any child instances that starts with "Icon"
figma.children('Icon*')

嵌套属性
当您不想连接子组件，而是想将其属性映射到父组件级别时，可以使用 `map` 函数figma.nestedProps()。此辅助函数以层名称作为第一个参数，以映射对象作为第二个参数。这些属性随后可以在函数中引用example。`map` 函数nestedProps始终选择一个实例，不能用于映射多个子组件。

// map the properties of a nested instance named "Button Shape"
figma.connect(Button, "https://...", {
  props: {
    buttonShape: figma.nestedProps('Button Shape', {
      size: figma.enum({ ... }),
    })
  },
  example: ({ buttonShape }) => <Button size={buttonShape.size} />
}


一种常见的模式是使用 ` nestedPropsthis.hashCode` 来访问条件隐藏的图层。这可以通过nestedProps结合使用 `this.hashCode` 和 `this.hashCode` 来实现boolean，并在条件为真时传递一个回退对象false。

figma.connect(Button, "https://...", {
  props: {
    childProps: figma.boolean("showChild", {
      true: figma.nestedProps('Child', {
        label: figma.string("Label")
      },
      false: { label: undefined }
    })
  },
  example: ({ childProps }) => <Button label={childProps.label} />
}


文本内容
Figma 设计系统中一个常见的模式是不使用 props 来控制文本，而是依赖实例来覆盖文本内容。figma.textContent()它允许你选择一个子文本图层并渲染其内容。它接受一个参数，即原始组件中图层的名称。

figma.connect(Button, "https://...", {
  props: {
    label: figma.textContent("Text Layer")
  },
  example: ({ label }) => <Button>{label}</Button>
}

类名
要将 Figma 属性映射到类名字符串，可以使用figma.className辅助函数。它接受一个字符串数组，并返回连接后的字符串。任何其他返回字符串（或 undefined）的辅助函数都可以与此函数结合使用。undefined 值或空字符串将从结果中过滤掉。

figma.connect("https://...", {
  props: {
    className: figma.className([
      'btn-base',
      figma.enum("Size", { Large: 'btn-large' }),
      figma.boolean("Disabled", { true: 'btn-disabled', false: '' }),
    ])
  },
  example: ({ className }) => <Button className={className} />
}


在开发者模式下，这段代码显示为：

<Button className="btn-base btn-large btn-disabled" />

变体限制
有时，Figma 中的一个组件在代码中会被多个组件表示。例如，Button你的 Figma 设计系统中可能只有一个组件，它有一个type属性可以在主要变体、次要变体和危险变体之间切换。然而，在代码中，这可能由三个不同的组件表示，例如 `<component>`、`<component>`PrimaryButton和SecondaryButton` DangerButton<component>`。

要在 Code Connect 中模拟这种行为，请使用变体限制。变体限制允许您为单个 Figma 组件的不同变体提供完全不同的代码示例。所使用的键和值应分别与 Figma 中变体（或属性）的名称及其选项相匹配。

figma.connect(PrimaryButton, 'https://...', {
  variant: { Type: 'Primary' },
  example: () => <PrimaryButton />,
})

figma.connect(SecondaryButton, 'https://...', {
  variant: { Type: 'Secondary' },
  example: () => <SecondaryButton />,
})

figma.connect(DangerButton, 'https://...', {
  variant: { Type: 'Danger' },
  example: () => <DangerButton />,
})

这也适用于 Figma 中非变体属性，例如布尔属性。

figma.connect(IconButton, 'https://...', {
  variant: { "Has Icon": true },
  example: () => <IconButton />,
})

在某些情况下，您可能还需要将代码组件映射到 Figma 中的多个变体组合。

figma.connect(DangerButton, 'https://...', {
  variant: { Type: 'Danger', Disabled: true },
  example: () => <DangerButton />,
})

连接图标
在 Figma 和代码中，图标的配置方式多种多样。我们建议在 Figma 中使用 instance-swap 属性来配置图标，这样您就可以使用稳定的 instance-swap 属性 ID 来访问嵌套的 Code Connect 图标。

重要提示：设计系统通常包含大量图标。可以使用脚本自动生成 Code Connect 文档，该脚本会将这些图标添加到新文件中。例如，一个icons.figma.tsx文件。我们提供了一个示例脚本作为参考。

图标作为 JSX 元素
如果您的图标是以 JSX 元素的形式在代码中传递的，那么您可以使用 Code Connect 来创建组件。

// icon
figma.connect("my-icon-url", {
  example: () => <IconHeart />
})

// parent
figma.connect("my-button-url, {
  props: {
    icon: figma.instance("InstanceSwapPropName")
  },
  example: ({ icon }) => <Button>{icon}</Button>
})

// renders in Dev Mode
<Button><IconHeart/></Button>

图标作为 React 组件
如果您的图标是以 React 组件的形式传递的，则可以在图标的 Code Connect 文件中返回 React 组件而不是 JSX 元素。

// icon
figma.connect("my-icon-url", {
  example: () => IconHeart
})

// parent
figma.connect("my-button-url, {
  props: {
    Icon: figma.instance<React.FunctionComponent>("InstanceSwapPropName")
  },
  example: ({ Icon }) => <Button Icon={Icon} />
})

// renders in Dev Mode
<Button Icon={IconHeart} />


将图标表示为字符串
通常情况下，图标会使用 ID 而不是传递组件。在这种情况下，您希望图标 Code Connect 文件仅返回该字符串。figma.instance它接受一个type参数，用于匹配嵌套模板的返回值。

// icon
figma.connect("my-icon-url", {
  example: () => "icon-heart"
})

// parent
figma.connect("my-button-url, {
  props: {
    iconId: figma.instance<string>("InstanceSwapPropName")
  },
  example: ({ iconId }) => <Button iconId={iconId} />
})

// renders in Dev Mode
<Button iconId="icon-heart" />

在父组件中访问图标属性
如果您需要根据父元素的不同来渲染图标，或者如果您想使用图标字符串但仍能映射图标组件的属性，则需要使用 `icon_strings` 或 `icon_properties`，getProps它们render在 `icon_strings` 的返回值中公开figma.instance()。example图标本身的函数决定了该图标在 Figma 中点击时的渲染方式，但可以通过这些额外的辅助函数进行“重写”。

getProps允许从父组件访问子组件的属性（例如图标），因此您可以在父组件中使用这些属性。请注意 static 属性iconId: "my-icon"——任何自定义/静态属性（例如此属性）都将包含在返回的对象中getProps。

// icon
figma.connect("my-icon-url", {
  props: {
    iconId: "my-icon",
    size: figma.enum("Size", {
      'large': 'large',
      'small': 'small'
    })
  }
  example: ({ size }) => <MyIcon size={size}/>
})

// parent
figma.connect("icon-button-url", {
  props: {
    iconProps: figma.instance("InstanceSwapPropName").getProps<{iconId: string, size: "small" | "large"}>()
  },
  example: ({ iconProps }) => <IconButton iconId={iconProps.iconId} iconSize={iconProps.size} />
})

// renders in Dev Mode
<IconButton iconId="my-icon" size="small" />


render允许您有条件地渲染嵌套的连接组件。参数会传递嵌套组件已解析的 props。例如，如果您需要根据布尔 prop 动态渲染不同的 JSX 元素，这将非常有用。

// icon
figma.connect("my-icon-url", {
  props: {
    iconId: "my-icon",
    size: figma.enum("Size", {
      'large': 'large',
      'small': 'small'
    })
  }
  example: ({ size }) => <MyIcon size={size}/>
})

// parent
figma.connect("icon-button-url", {
  props: {
    icon: figma.boolean("Show icon", {
      true: figma.instance("InstanceSwapPropName").render<{iconId: string, size: "small" | "large"}>(props => <ButtonIcon id={props.iconId} size={props.size}/>),
    }
  },
  example: ({ icon }) => <Button icon={icon}/>
})

// renders in Dev Mode
<Button icon={<ButtonIcon id="my-icon" size="small" />} />