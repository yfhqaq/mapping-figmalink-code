# UX Components Snapshot (SDS v4.0.0)

Source:
- Figma file key: `JU4Freq42yQFn1GTe97pLy`
- MCP tool: `Framelink Figma MCP`
- Captured: 2026-01-30

## All UX Components (Top-Level Frames)

Page: `基础组件`

- ↳🔎01页头 Header (`13653:80031`) — 1531×1131
- ↳📝01输入框 Input (`13639:13631`) — 1781×2309
- Frame 625009 (`16606:11660`) — height 476
- ↳📝02文本域 Textarea (`16619:188499`) — 1197×1574
- 数据录入 Data Entry (`13653:56754`) — layout `layout_M0KQRF`
- 数据展示 Data Entry (`13653:80605`) — layout `layout_M0KQRF`
- 反馈 Feedback (`13653:80977`) — layout `layout_M0KQRF`
- 封面 thumbnail (`20036:10816`) — layout `layout_M0KQRF`
- 通用 General Purpose (`13653:56768`) — layout `layout_M0KQRF`
- 导航 Navigation (`13653:56771`) — layout `layout_M0KQRF`
- ↳🎨01标签 Tag (`13659:9242`) — 1197×1084
- ↳🎨02徽标 Badge (`13660:8917`) — 1440×847
- ↳🎨04附件 Attach files (`14089:3887`) — 1440×879
- ↳🎨05进度条 Progress Bar (`16612:187106`) — 702×1239
- ↳🎨06标题 Title (`16618:188210`) — 702×468
- ↳🎨07组合字段 (`16618:188391`) — 1041×1064
- ↳🎨08统计数值 (`17559:42640`) — 1105×881
- ↳🎨09导入组件 (`17598:35647`) — 1105×881
- ↳🎨03表格 Table (`13665:7731`) — 2339×6294
- ↳📝03选择器 Select (`13653:14515`) — 1827×4129
- ↳📝07单选 Radio (`275:15882`) — 904×1262
- ↳📝08复选 Checkbox (`13653:14028`) — 735×1262
- ↳📝04日期选择器 DatePicker (`13653:56357`) — 1571×1097
- ↳📝05时间选择器 TimePicker (`16649:28156`) — 1571×1097
- ↳📝09开关 Switch (`13656:9366`) — 541×548
- ↳📝10上传组件 Upload (`13653:12751`) — 862×1382
- ↳📝13表单 Form (`13653:80607`) — 1336×923
- 表单项 (Instance) (`27172:12135`) — width 328
- ↳📝06筛选 Query (`13656:11102`) — 1177×1461
- ↳📝11穿梭框 Transfer (`16617:187857`) — 1440×744
- ↳📝12折叠面板 Collapse (`16617:188111`) — 1488×1942
- ↳🔎03侧边栏 Sidebar (`13653:56982`) — 4943×2228
- ↳🔎02标签页 Tabs (`13653:64026`) — 1092×1438
- ↳🔎04分页 Pagination (`13653:65464`) — 914×375
- ↳⚙️01工具 Tool (`2608:17576`) — 1464×2019
- A 颜色 Color (`13601:11229`) — 1440×2308
- ↳📪01对话框 Modal (`13637:27054`) — 1440×996
- ↳📪02气泡提示 Popover (`13631:12120`) — 1440×2323
- ↳📪03文字提示 Tooltips (`13631:12362`) — 1440×662
- ↳📪04警告提示 Alert (`13656:12030`) — 848×1271
- ↳📪05全局提示 Message (`13659:9000`) — 581×817
- A 字体 Typography (`135:10203`) — 1440×1354
- ↳⚙️02按钮 Button (`16619:189916`) — 1540×1605
- ↳⚙️03滚动条 (`16638:9333`) — 1496×885
- ↳⚙️04底部操作栏 (`16772:34417`) — 1496×885
- ↳🔮水印 Watermark (`23726:13425`) — 1496×1023
- 文字水印（不带时间戳版本存档）勿删 (`24261:23107`) — 1288×728
- ↳🖼️01文件封面 thumbnail (`20036:10815`) — 7161×9654

Page: `页面模板`

- ↳01表单页 Form Page (`2345:15857`) — 4400×3483
- ↳02列表页 List Page (`13682:4017`) — 3532×3019
- ↳03详情页 Detail Page (`13683:4027`) — 1568×3323
- ↳04异常页 Exception Page (`16693:20074`) — 1568×4397
- 初始页 (`18304:42390`) — 1568×1069

Notes:
- Sizes are read from layout dimensions in MCP output.
- This is a top-level frame inventory; nested component sets/variants exist inside each frame.

## Selected Components (2 large + 2 small)

Large:
- Table (`13665:7731`) — 2339×6294
- Sidebar (`13653:56982`) — 4943×2228

Small:
- Switch (`13656:9366`) — 541×548
- Tag (`13659:9242`) — 1197×1084

---

## Node Details (Structured Snapshot)

### Table — `13665:7731` (FRAME)

Basic:
- Name: `↳🎨03表格 Table `
- Size: 2339×6294
- Layout key: `layout_GZCCLY`
- Fill: `#FFFFFF`

Top-level children:
- `16670:17702` Frame 427319460 (FRAME) — private component + table cell component sets
- `13665:7734` header (FRAME) — title + divider
- `16612:187792` Frame 427319430 (FRAME) — A 模板：单行纯文本模板
- `16612:187793` Frame 427319431 (FRAME) — A 模板：多行字段模板
- `24016:25544` Frame 427319914 (FRAME) — A 模板：录入组件模板
- `16612:187794` 【A模板】可展开表格模板 (TEXT)
- `16562:157280` A｜可展开表格模板 (COMPONENT)
- `16670:17741` Frame 427319461 (FRAME) — A 模板：空状态模板
- `16612:187789` Frame 427319429 (FRAME) — 列
- `17603:44449` Frame 427319913 (FRAME) — 表格操作栏

Key component sets inside `Frame 427319460`:
- `.单元格-操作` (`16435:13798`) — variants: 横排/竖排
- `.单元格-表体` (`16435:13745`) — variants: 链接/金额/基础/进度条/图标/单标签/多标签/大图片/小图片/开关/附件/输入框/文本域/选择器/日期选择器/时间选择器/评级/多字段/状态
- `.表体-操作` (`16435:13728`) — variants: 单选/展开/收起/复选/拖拽/未读
- `.表头-操作` (`16435:13706`) — variants: 复选框/空表头
- `.表头-文本` (`17559:42478`) — variants: 左对齐/右对齐/居中
- `.表格输入框` (`16595:182850`)
- `.表格文本域` (`16602:183882`)
- `.表格选择器` (`16605:185236`)
- `.表格日期选择器` (`16605:185919`)
- `.表格时间选择器` (`16649:28260`)

Selected variant examples (from the node tree):
- `.单元格-表体` → `类型=开关` uses `开关` instance (`13656:9450`)
- `.单元格-表体` → `类型=单标签` uses `基础标签` instance (`16465:26884`)
- `.表体-操作` → `类型=复选` uses `.复选框` instance (`13653:14001`)

---

### Sidebar — `13653:56982` (FRAME)

Basic:
- Name: `↳🔎03侧边栏 Sidebar`
- Size: 4943×2228
- Layout key: `layout_2BL1LF`
- Fill: `#FFFFFF`

Top-level children:
- `26721:4366` Rectangle 2503 (RECTANGLE) — background panel
- `26721:4369` Frame 1321319219 (IMAGE-SVG)
- `13653:60326` header (FRAME) — title + divider
- `16625:190243` Frame 427319449 (FRAME) — “私有组件” + 一级/二级/三级导航状态
- `16626:190247` Frame 427319451 (FRAME) — 侧边导航组件集（含多应用态）

Key component sets inside `Frame 427319449`:
- `.一级/收起` (`23715:10623`) — variants: 选中=off/on
- `.一级/展开` (`23846:13616`) — variants: 选中=off/on
- `.二级` (`23715:10686`) — variants: 展开=off/on
- `.三级` (`23715:10701`) — variants: 选中=off/on
- `.二级悬停收起` / `.二级悬停展开` / `.三级悬停`

Key component set inside `Frame 427319451`:
- `侧边导航` (`23715:10452`) — variants by app + expand states

---

### Switch — `13656:9366` (FRAME)

Basic:
- Name: `↳📝09开关 Switch`
- Size: 541×548
- Layout key: `layout_291LA7`
- Fill: `#FFFFFF`

Top-level children:
- `13656:9369` header (FRAME) — title + divider
- `13656:9376` Frame 625013 (FRAME)

Key component set inside `Frame 625013`:
- `开关` (`13656:9413`) — variants:
  - 开启=false, 加载中=false, 禁用=true (`13656:9436`)
  - 开启=false, 加载中=true, 禁用=false (`13656:9438`)
  - 开启=false, 加载中=false, 禁用=false (`13656:9440`)
  - 开启=true, 加载中=false, 禁用=true (`13656:9446`)
  - 开启=true, 加载中=true, 禁用=false (`13656:9448`)
  - 开启=true, 加载中=false, 禁用=false (`13656:9450`)

---

### Tag — `13659:9242` (FRAME)

Basic:
- Name: `↳🎨01标签 Tag `
- Size: 1197×1084
- Layout key: `layout_0R8BCR`
- Fill: `#FFFFFF`

Top-level children:
- `13659:9463` header (FRAME) — title + divider
- `13660:8896` Frame 625044 (FRAME) — 基础 Tag + 状态 Tag
- `25209:23293` Frame 1321319217 (FRAME) — 筛选区 tag

Key component sets inside `Frame 625044`:
- `基础标签` (`16465:26850`) — color variants: magenta/red/volcano/orange/gold/lime/green/cyan/blue/geekblue/purple/default
- `圆点状态` (`16465:25185`)
- `标签状态` (`16465:25079`)
- `标签状态(带图标)` (`16465:25008`)
- `异步tag` (`16465:25036`)

Key component set inside `Frame 1321319217`:
- `.筛选区tag` (`25209:23112`) — variants: 类型=标签 / 类型=计数
