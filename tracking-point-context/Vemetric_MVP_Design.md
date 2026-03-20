# Vemetric MVP 埋点系统设计方案 (V1.0)
---

## 一、 核心理念：五层模型 (L1-L5)
所有埋点在定义时必须强制关联以下层级，作为系统自动诊断的逻辑基准：

| 层级 | 维度 | 核心指标 | 业务价值 |
| :--- | :--- | :--- | :--- |
| **L1** | 存活与流量 | PV/UV、活跃用户数、留存率 | 系统是否有人在用？ |
| **L2** | 路径与转化 | 跨应用漏斗转化率、关键流失点 | 用户是否按预期完成了任务？ |
| **L3** | 体验与交互 | 愤怒点击、操作犹豫时长、曝光深度 | 系统好不好用？用户是否有挫败感？ |
| **L4** | 性能与稳定 | 页面加载、接口耗时、P95/P99、慢请求占比、错误率 | 系统拖不拖后腿？（**MVP 先依托 ARMS**） |
| **L5** | 业务效率与价值 | 完成量、完成率、平均完成耗时、人效 | 值不值得继续投入？（**损失金额/损失业务量等先不做**） |

---

## 二、阶段一（Q1）MVP 实施排期（15 天：系统搭建与覆盖验证）

> 说明：
> - 你提出的“开发者沙盒/可视化抓包/实时流”不影响平台可用性，**从 MVP 移除**，放入 V-Next。
> - **MVP 仅实现里程碑【阶段一】能力**：系统搭建 + 覆盖验证（事件维度 Table + L1 指标）。
> - 里程碑【阶段二及以后】（路径/体验/人效/会话追溯/性能报告/告警）全部归入后续迭代。
> - **埋点需求管理暂时通过飞书进行**；MVP 数据库只需要保存“需求链接”（用于追溯），不做复杂需求流转系统。

### Day 1：冻结阶段一数据协议 + 最小事件字典（定义先行）
- **交付物**
  - 冻结 `Vemetric_Technical_Specs.md` 的 **阶段一（MVP）事件信封**必填字段：`context/user/event`
  - 产出一个 `event_dictionary` 初始清单（10-30 个事件足够），覆盖 **阶段一重点业务页面/功能点**（以“功能事件”为主）
  - 事件字典字段最小集合（MVP 必备）：`code/name/level/type/required_props/owner/status/version/requirement_url`
- **验收标准**
  - 每个事件都有：`code/name/level/type/required_props/owner/status/version/requirement_url`（需求链接为飞书文档/需求卡片）

### Day 2：Collector（Node 接入层）骨架 + 入库最小链路
- **交付物**
  - `/collect` 接口（JSON）+ CORS + gzip（可选）+ request size 限制
  - 入库到 `raw_events`（先不做聚合）
- **验收标准**
  - curl/前端模拟上报能写入 Mongo；字段能保持原样

### Day 3：Mongo 初始化（索引 + TTL）+ 字典服务化（读缓存）
- **交付物**
  - `raw_events` 索引（按 **L1 + org/role** 优先）：`event.name/event.ts/context.app_id/user.org_id/user.role/user.user_id/user.anonymous_id`
  - TTL（MVP 30 天）
  - 服务端启动加载 `event_dictionary` 到内存（或缓存），提供字典查询接口（供 SDK/服务端校验使用）
- **验收标准**
  - 事件维度统计（按 app_id、org_id、role）能命中索引并在可接受时间内返回

### Day 4：SDK 二次封装“外壳”（基于成熟开源 SDK）
- **说明**：SDK 不从零写，**基于稳定、安全、可扩展的开源 SDK 二次封装**（如 `sa-sdk-javascript` 的思路/能力）。
- **交付物**
  - `init()`：注入 `app_id/env/server_url`
  - `track(code, props)`：自动补齐 `context/user` 外壳（阶段一不强依赖 session/trace）
  - `anonymous_id` 生成；支持注入 `user_id/org_id/role`
- **验收标准**
  - 在任意 React 页面调用 `track()`，后端能收到完整 envelope

### Day 5：重点业务页面埋点（首批覆盖验证）
> 对齐里程碑【阶段一】：重点页面先埋点，用于首批能力验证。
- **交付物**
  - `gds` 首批重点业务页面埋点（按字典的事件 code 落地）
  - 元素/功能点命名规范：`data-v-track` / `data-v-element-id`（便于统一口径与治理）
- **验收标准**
  - 首批页面的关键事件能稳定上报；事件 code 与字典一致；必填字段齐全

### Day 6：组织/角色维度补齐（公司 + 角色）
- **交付物**
  - 统一 `user.org_id`（公司/组织）与 `user.role`（角色）获取方式（推荐服务端 enrich；前端可注入兜底）
  - 明确“目标用户口径”与总盘子来源（为覆盖率做准备）
- **验收标准**
  - 支持按 `org_id + role` 切分查看活跃/覆盖/使用频次

### Day 7：事件字典管理（最小闭环：CRUD + 发布版本）
- **交付物**
  - 事件字典 CRUD（可先做简单管理页/接口）：新增/编辑/停用（deprecated）
  - 字典发布版本（version + 快照），并保留发布人/发布时间
- **验收标准**
  - 新增/变更事件必须落到字典；发布新版本后，服务端能加载最新版本并记录版本号

### Day 8：服务端校验（strict/lenient）+ unknown 旁路
- **交付物**
  - Collector 收到事件后按字典校验：事件是否存在、必填字段、类型/枚举
  - `strict/lenient` 开关：lenient 进入 `unknown_events`（带 app_id、org/role、sdk_version、dict_version）
- **验收标准**
  - 能持续发现“漏埋/乱埋/字段错”，并能追溯到责任人（owner）与需求链接（requirement_url）

### Day 9：全量事件 Table（事件维度分析 v1）
> 对齐里程碑【阶段一】：回答“有没有人用”“是不是伪需求”。
- **交付物**
  - 事件维度 Table（按事件 code 展示）：活跃用户数、功能使用用户、功能覆盖率、人均使用次数
  - 支持按 `org_id + role` 维度切分
- **验收标准**
  - 能算：`活跃用户数 distinct(user_id)`、`功能使用用户 distinct(user_id where event)`、`功能覆盖率 功能UV/总UV`、`人均使用次数 count(event)/user`

### Day 10：全量事件 Table（事件维度分析 v1）
> 对齐里程碑【阶段一】：先回答“有没有人用”，并能按事件维度看覆盖/使用/频次。
- **交付物**
  - 事件维度 Table（按事件 code 展示）：活跃用户数、功能使用用户、功能覆盖率、人均使用次数（使用频次）
  - 支持按 `org_id + role` 维度切分（B 端必备）
- **验收标准**
  - 能算：`活跃用户数 distinct(user)`、`功能使用用户 distinct(user where event)`、`功能覆盖率 功能UV/总UV`、`人均使用次数 count(event)/user`

### Day 11：数据质量（MVP）与验收 Checklist
- **交付物**
  - Data Quality 指标：unknown 事件量、字段缺失/类型错误次数、上报延迟、重复上报率（最小集合）
  - 验收 Checklist：按“事件/字段/口径/维度”逐项验收
- **验收标准**
  - QA/数据能基于 Checklist 完成验收；上线后异常能定位到 event + owner + requirement_url

### Day 12：覆盖率（目标用户覆盖率）口径落地
- **交付物**
  - 覆盖率口径：`覆盖用户 / 目标用户`（目标用户来源/同步方式明确）
  - 在表格中展示“目标用户覆盖率”（与业务目标盘子对齐）
- **验收标准**
  - 能按 org/role 看到目标用户覆盖率，并能用于识别“功能没被感知/入口不明显”

### Day 13：聚合任务 v1（事件维度宽表）
- **交付物**
  - 定时聚合脚本：按天产出 `event_metrics_daily`（覆盖/使用/频次），并支持 org/role 维度
- **验收标准**
  - Echarts/表格读取宽表即可渲染（不直接扫 `raw_events`）

### Day 14：看板 v1（阶段一）
- **交付物**
  - 事件维度 Table + 趋势图（活跃、覆盖、频次）
  - 支持筛选：app_id、org_id、role、时间范围
- **验收标准**
  - 业务方能用看板回答：有没有人用、哪些功能被用、覆盖是否达预期、是否伪需求

### Day 15：MVP 验收与交付（阶段一）
- **交付物**
  - 一份“验收清单”：对应 `指标.md`（阶段一：L1）逐项打钩
  - 一份“字典治理约定”：命名规范、owner 责任、需求链接留存、版本发布节奏
- **验收标准**
  - 业务方能用看板回答：有没有人用、哪些功能被用、覆盖是否达预期、是否伪需求（并可按 org/role 拆分）

---

## 三、 技术架构图
1. **SDK (React)**: 挂载在微应用基座，通过 `IntersectionObserver` 和 `MutationObserver` 实现无感追踪。
2. **Gateway (Node.js)**: 校验 -> 增强 (Enrich) -> 写入。
3. **Storage (MongoDB)**: 文档型存储，支持事件属性的动态扩展。
4. **Dashboard (React + Echarts)**: 针对 L1-L5 分别设计分析维度。

---

## 四、 关键差异化优势（超越阿里云）
1. **跨应用连续性**: 针对微应用深度定制的 Context 透传。
2. **覆盖验证（MVP）**: 能回答“有没有人用/是否伪需求/覆盖是否达预期”（事件维度 Table + org/role 切分）。
3. **轻量管理**: 自带事件字典，从源头解决数据乱象，而非事后清洗。

---

## 五、MVP 管理闭环（只做“最小可用”，但不阻塞后续扩展）

> 参考“埋点管理系统”的核心诉求：元信息集中、验收可视化、问题可追溯、版本可回滚。

### 1) MVP 必做功能
- **事件字典（Event Dictionary）**：事件编码/中文名/L1-L5 层级/事件类型/必填属性/owner/状态（draft/active/deprecated）
- **字典发布（Versioning）**：字典变更必须“发布成版本”，SDK/服务端校验读取指定版本（默认最新）
- **校验开关**：支持 `strict`（不在字典的事件拒收）与 `lenient`（落入 unknown + 告警）两种模式
- **验收方式（MVP）**：先以“**验收 Checklist + 指标对账 + 数据库抽查**”验收（不做实时流/沙盒 UI）
 - **需求追溯（MVP）**：埋点需求仍在飞书管理，但事件字典必须保存 `requirement_url`（飞书需求链接），用于回溯“为何要埋/谁提的/口径是什么”

### 1.1 基于 20 篇行业文章的 MVP 优化补丁（不显著增加工期）
> 这些改动来自“治理/规范/质量/协作/前后端边界”的高频共识，详见 `埋点文章调研与MVP优化建议.md`。

#### A) 3 个“模板/清单”比加功能更值（Day 1/Day 15 补齐）
- **埋点需求模板**：目标指标（对齐 L1-L5）/口径/触发条件/事件 code/必填字段/取值示例/owner/上线版本
- **埋点验收 Checklist**：事件是否出现、必填字段/类型/枚举、重复/漏发、关键指标对账（与 `指标.md` 口径对齐）
- **unknown/invalid 处理清单**：unknown 事件→补字典/下线/修 SDK；invalid 字段→修业务侧/修校验规则；每条都有 owner 与截止时间

#### B) 明确“前端/后端权威边界”（后续阶段用，MVP 先固化规则）
- **前端权威**：交互/曝光/基础行为（`ui_* / page_*`）
- **后端权威**：业务结果类事实（如 `biz_outcome`），以 `biz_id` 为对账键（前端 outcome 仅作候选/补充）

#### C) 把“版本”用起来：落库必须带字典版本（可追溯）
- Collector 落库时写入 `dict_version`（或 `event.dict_version`），用于回溯“当时口径是哪版/谁发布的”

#### D) 增加最小 Data Quality 面板（Day 15 一起交付，避免数据变垃圾场）
- unknown 事件数量（按 app_id/版本/owner）
- 字段缺失/类型错误次数（按事件 code）
- 上报延迟（event.ts 与 server_ts 差值分布）
- 重复上报率（同 session 同事件同元素短时间重复）

### 2) V1 不做但预留扩展点（V-Next）
- 开发者沙盒（控制台高亮）、可视化抓包/实时流、可视化圈选、录屏回放、权限体系、告警体系（钉钉/飞书/邮件）

---

## 六、参考资料（设计依据）
- [如何设计出一个实用高效的埋点管理系统？](https://www.woshipm.com/data-analysis/5107308.html)
- [如何设计企业级数据埋点采集方案？](https://www.cnblogs.com/bytedata/p/16695824.html)
- 阿里云 ARMS RUM 相关文档：
  - `https://help.aliyun.com/document_detail/252716.html`
  - `https://help.aliyun.com/document_detail/252718.html`
  - `https://help.aliyun.com/document_detail/327153.html`
  - `https://help.aliyun.com/document_detail/399751.html`
  - `https://help.aliyun.com/document_detail/2840363.html`
