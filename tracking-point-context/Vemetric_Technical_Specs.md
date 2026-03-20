# Vemetric 技术规格说明书（MVP，可迭代）

本文档定义 Vemetric **阶段一（Q1）MVP** 的 **数据 Schema、事件字典（管理）、SDK 上报协议、后端落库与聚合口径**。目标是：在第一版先把“系统搭建 + 覆盖验证（L1）+ 基础治理闭环”跑通，同时保证后续阶段可无痛扩展到路径/体验/效率/性能等能力。

---

## 一、MVP 范围与设计原则

### 1. MVP 必须支持的能力（仅阶段一，对齐 `指标.md` + 里程碑）
- **L1 覆盖与使用（MVP 必做）**：活跃用户数、覆盖率（目标用户覆盖率）、功能使用用户、功能覆盖率、使用频次（人均使用次数）
- **基础治理闭环（MVP 必做）**：事件字典管理（CRUD + 版本发布 + 服务端校验 strict/lenient + unknown 旁路）
- **组织/角色维度（MVP 强依赖）**：支持按 `org_id + role` 切分查看 L1 指标（里程碑明确要求“公司 + 角色维度”）

> 后续阶段能力（不属于阶段一 MVP）：L2 路径与转化、L3 体验与交互、L4 性能与稳定（系统内性能报告）、L5 效率与价值等。

### 2. 原则（来自行业最佳实践）
- **先定义、后采集**：事件/属性必须在字典中定义（否则降级入“unknown”并告警）。
- **分层建模**：把数据拆成 `context/session/user/event/perf/biz`，避免一个大 JSON 越长越乱。
- **同名同义**：事件名是“语义键”，任何人任何端上报同一含义必须复用同一事件名。
- **可追溯**：事件必须能追溯到“哪个需求/哪个版本/哪个责任人”。

### 3. 逻辑数据模型与指标血缘（MVP 推荐）
为解决“指标/事件/属性/埋点仅靠命名关联、缺少形式化约束”的问题，MVP 推荐引入“逻辑外键 + 指标依赖矩阵（数据血缘）”：
- 逻辑数据模型（ER / Logical FK / 版本快照）：见 `Vemetric_Logical_Data_Model.md`
- 指标依赖矩阵：用于在变更事件/属性/阈值时，自动提示受影响的指标集合（变更影响分析）

---

## 1.4 前端埋点 vs 后端埋点：权威边界与对账口径（后续阶段用，MVP 先留规则）
> 行业实践的高频共识：交互/性能偏前端，结果/账务偏后端；不划边界会导致 L5 不可信。

### 1) 前端权威（SDK 负责）
- `page_view / page_leave`
- `ui_click / ui_exposure`
- `api_perf / js_error`
- `path_step` 的“过程节点”（start/step/end 的过程描述）

### 2) 后端权威（服务端负责，建议作为 L5 的主来源）
- `biz_outcome`（success/fail/abandon 等“结果类”事实）
- 关键业务事实（如订单完成、支付成功、合同生效）应优先以服务端日志/事件为准

### 3) 对账规则（MVP）
- 以 `biz.biz_id` 为键，对 `biz_outcome` 做对账：**后端 outcome 覆盖前端候选 outcome**。
- 前端 `biz_outcome` 允许存在（用于路径内快速定位），但在聚合口径里必须明确“候选/最终”。

---

## 1.5 数据质量管理（MVP 版：不做复杂告警，也要可控）
> 目标：避免“采到了但不可用”，把质量问题前置到 Collector/聚合的可观测指标里。

### 1) unknown / invalid 事件旁路
- **unknown（不在字典）**：`lenient` 模式下落入 `unknown_events`（或在 `raw_events` 标记 `event.is_unknown=true`），并记录：
  - `event.name`、`context.app_id/micro_app_id`、`event.sdk.version`、`dict_version`、`owner(若可解析)`
- **invalid（字段不合法）**：字段缺失/类型错误/枚举非法不建议直接丢弃；MVP 推荐落库并标记：
  - `event.validation_errors[]`（如 `missing_required_prop:order_id`、`invalid_enum:pay_type`）

### 2) 最小质量指标（建议 Day 15 看板加一块 Data Quality）
- unknown 事件量（按 app_id/版本/owner）
- 字段缺失/类型错误次数（按事件 code）
- 上报延迟（`abs(server_ts - event.ts)` 分布）
- 重复上报率（同 `session_id + event.name + element.id` 的短窗口重复）

---

## 术语解释（Glossary）

### 事件信封（Event Envelope）
**事件信封**可以理解为“快递包装盒”：不管里面是点击、曝光、接口耗时还是报错，外面都用同一套结构包起来，统一携带上下文，从而实现**自动关联与可治理**。

- **“盒子外壳”固定字段**：`context / session / user / event / perf / biz`
- **为什么需要它**：
  - 让性能事件（L4）和业务事件（L5）能靠 `trace_id/session_id/biz_id` 自动关联（支撑 `slow/error × biz_id`）
  - 微应用跨子应用跳转时，仍能靠统一外壳把同一次路径串起来（L2）

一句话：**Event Envelope = 统一事件格式（带上下文），让所有事件可关联、可聚合、可治理。**

### 聚合宽表（Aggregated Wide Table）
**聚合宽表**指“为看板/报表准备的预计算结果表”：把海量 `raw_events` 明细按固定维度（如天/应用/路径/接口）提前汇总成少量行，列是固定指标，方便秒级查询与展示。

- **raw_events（明细事实表）**：事件一条一条存，量大、字段动态，适合追溯与重算，但不适合直接做看板
- **聚合宽表（统计结果表）**：按维度聚合后输出固定列，适合 Echarts/看板
- **为什么 MVP 推荐“raw_events + 聚合宽表”**：
  - Mongo 直接扫明细做统计会越来越慢
  - 宽表口径稳定（只保留认可的指标列），字段演进不会影响看板查询

一句话：**聚合宽表 = 为看板准备的“预计算指标表”，让查询快、口径稳。**

---

## 二、数据模型总览（四类数据 + 一个字典）

> 这不是“表结构”，而是**事件信封（event envelope）**。后端落库可以是单表（raw_events）+ 索引，也可以拆表。MVP 推荐单表 + 聚合宽表。

### 1) Event Envelope（所有上报的统一外壳）
- `context`：运行环境与微应用信息（L1/L2/L4）
- `session`：会话维度字段（L2/L3/L5）
- `user`：用户标识与画像快照（L1/L5）
- `event`：事件本体（L1-L5）
- `perf`：性能/稳定（L4）
- `biz`：业务对象与价值字段（L5）

### 2) Event Dictionary（事件字典，管理闭环的核心）
- 定义事件语义、层级、必填属性、口径、owner、状态、版本等（MVP 必做）。

#### 2.1 事件字典是什么（你可以把它当作“埋点的产品说明书”）
在成熟平台里（字节/阿里云这类实践），埋点长期最大的问题不是“采不到”，而是：
- **采到了但没人知道是什么意思**（事件名像 `click_btn_01`）
- **同一件事被不同团队用不同事件名上报**（口径分裂）
- **字段缺失/类型乱**，导致指标算不出来或算出来不可信
- **上线后数据异常**，无法追溯“哪个版本/谁改的/当时口径是什么”

事件字典要解决的是：把“埋点”从一次性的代码行为，变成可治理的数据资产。

#### 2.2 MVP 版本我们到底“管理什么”（最小闭环）
MVP 不做复杂审批流，但必须能做到 4 件事：
- **定义**：一个事件的唯一语义（code/name/level/type/触发条件/字段口径）
- **约束**：哪些字段必填、类型是什么、枚举有哪些（required_props）
- **追溯链接**：事件必须关联一个“需求来源链接”（MVP 先用飞书管理需求，数据库保存链接即可）
- **追溯**：责任人、状态、版本（owner/status/version）

#### 2.3 为什么必须关联 L1-L5（否则无法“自动分析”）
`指标.md` 的很多指标不是“单条事件就能算”，而是“事件之间的关系”：
- L2：`路径发起量 = distinct(trace_id)`、步骤转化需要 `path_id/step_id`
- L3：重复点击/操作间隔/停留时间需要会话上下文
- L5：`slow/error × biz_id` 需要把性能事件与业务事件在同一条链路上关联起来

字典里的 `level/type/biz_rules/perf_rules` 就是把这些“关系和口径”固化下来，让后端能自动做聚合与归因，而不是每次分析靠人脑和 SQL 临时拼。

#### 2.4 事件字典（MVP）推荐数据结构（兼容后续扩展）
> 这是我们 MVP 最小可行字段集合；后续加字段不会影响 SDK 协议。

```json
{
  "code": "click_order_pay",
  "name": "确认支付点击",
  "type": "ui_click",
  "level": "L3",
  "requirement_url": "https://xxx.feishu.cn/docx/xxxx",
  "owner": "pm_zhangsan",
  "status": "active",
  "version": 1,
  "description": "用户在收银台点击“确认支付”按钮",
  "required_props": {
    "order_id": { "type": "string", "required": true },
    "pay_type": { "type": "string", "required": false, "enum": ["alipay", "wechat", "card"] }
  }
}
```

#### 2.5 字典在系统里怎么“工作”（MVP 的实际流程）
这里给一个最贴近工程落地的流程（不需要做复杂 UI 也能跑起来）：
- **Step A：字典创建/更新**
  - 产品/数据/研发在 `event_dictionary` 里新增或更新事件定义（MVP 可先用 JSON 文件或简单 CRUD 页面）
- **Step B：字典发布（version + 快照）**
  - 每次发布生成一个 `version`（整数递增），并保存一份“快照”（便于回滚与追溯）
- **Step C：服务端校验**
  - Collector 收到事件后用内存缓存的字典校验：
    - 事件是否存在
    - `event.type/level` 是否匹配
    - 必填属性是否缺失、类型/枚举是否合法
  - 校验失败处理策略：
    - `strict`：拒收（返回 400）
    - `lenient`（推荐 MVP）：落入 `unknown_events` + 记录告警字段（不阻塞业务上报）
- **Step D：聚合与看板**
  - 聚合任务按字典规则计算 L1-L5 指标（尤其是 slow 阈值、loss window、success events）

---

## 2.6 事件字典（MongoDB）表结构建议（MVP 阶段一）
> 目标：阶段一只做“覆盖验证 + 基础治理闭环”。埋点需求仍在飞书管理，但必须在字典里保存 `requirement_url` 便于追溯。

### A) `event_dictionary`（事件定义表，当前生效版本视图）
每条记录代表一个“事件定义”（同一 `code` 可随版本演进）。

**推荐字段（最小可行 + 可扩展）**：
- `code` (string, unique)：事件编码（唯一语义键）
- `name` (string)：中文名（展示用）
- `level` ('L1'|'L2'|'L3'|'L4'|'L5')：层级（阶段一主要用 L1，但字段保留）
- `type` (string)：事件类型（阶段一可统一为 `custom` 或按你们实际划分）
- `description` (string, optional)：口径说明/触发条件（建议写清楚）
- `required_props` (object, optional)：必填字段与类型约束（用于服务端校验）
- `owner` (string)：责任人（PM/数据/研发）
- `status` ('draft'|'active'|'deprecated')：生命周期状态
- `version` (number)：当前生效的字典版本号（发布后写入）
- `requirement_url` (string, optional)：飞书需求链接（你的要求：数据库只存链接即可）
- `tags` (string[], optional)：如 `['gds','阶段一','核心页面']` 便于筛选
- `created_at` / `updated_at` (date)
- `created_by` / `updated_by` (string, optional)

**推荐索引**：
- unique：`{ code: 1 }`
- 查询：`{ status: 1, level: 1 }`
- 查询：`{ owner: 1, status: 1 }`
- 查询：`{ version: 1 }`

### B) `dictionary_versions`（版本发布表，快照与回滚依据）
每次“发布”生成一条版本记录，包含变更说明与快照引用。

**推荐字段**：
- `version` (number, unique)：版本号（递增）
- `published_at` (date)
- `published_by` (string)
- `changelog` (string, optional)：变更说明（给排查/回滚用）
- `snapshot` (object | string)：字典快照（两种方式二选一）
  - **方式1（推荐 MVP）**：直接存快照 JSON（体量可控时最省事）
  - **方式2**：存对象存储地址/文件路径（快照很大时再用）

**推荐索引**：
- unique：`{ version: 1 }`
- 查询：`{ published_at: -1 }`

### C) 发布与回滚的最小规则（MVP）
- **发布**：写入一条 `dictionary_versions`（含 snapshot）→ 批量更新 `event_dictionary.version = newVersion`
- **回滚**：选择一个历史 `version` → 用该版本 snapshot 覆盖 `event_dictionary`（或批量更新回滚到旧版本）
- **追溯**：Collector 落库事件时写入 `dict_version`（或 `event.dict_version`），从而“当时口径是哪版”可查

---

## 三、Event Envelope 详细 Schema（字段级别，含 L1-L5 映射）

### 0. 通用约束
- **时间单位**：所有耗时字段统一为 `ms`。
- **ID 规则**：所有 ID 字段统一为 string（避免 BigInt/number 精度问题）。
- **枚举字段**：必须使用字典定义的枚举值（否则标记 `invalid_enum`）。
 - **版本追溯**：MVP 推荐在事件中携带 `dict_version`（用于回溯“当时口径是哪一版”）。

### 1. `context`（环境与微应用上下文）
| 字段 | 类型 | 必填 | 说明 | L 层级 | 来源 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `context.app_id` | string | Y | 应用唯一标识（主应用/子应用） | L1 | SDK init |
| `context.app_name` | string | N | 展示名（便于看板） | L1 | 字典/配置 |
| `context.micro_app_id` | string | N | 微应用 ID（子应用） | L2 | 容器注入 |
| `context.micro_app_version` | string | N | 子应用版本（发布追溯） | L5 | 构建注入 |
| `context.env` | 'dev'\\|'test'\\|'staging'\\|'prod' | Y | 环境 | ALL | SDK init |
| `context.page_url` | string | Y | 当前 URL（含 query） | L2/L3 | location |
| `context.page_path` | string | Y | pathname（不含 query） | L2 | location |
| `context.referrer` | string | N | referrer | L2 | document.referrer |
| `context.ua` | string | N | User-Agent | L4 | header |
| `context.device_type` | 'pc'\\|'mobile'\\|'tablet' | N | 设备类型 | L1 | SDK |
| `context.os` | string | N | 操作系统 | L1 | SDK |
| `context.browser` | string | N | 浏览器 | L1 | SDK |
| `context.network` | 'unknown'\\|'2g'\\|'3g'\\|'4g'\\|'5g'\\|'wifi' | N | 网络类型 | L4 | navigator |
| `context.country` | string | N | 国家 | L1 | server enrich |
| `context.region` | string | N | 省/州 | L1 | server enrich |
| `context.city` | string | N | 城市 | L1 | server enrich |

> **微应用核心要求**：`trace_id` 必须跨微应用不变；`micro_app_id` 用于在 session 时间轴里“染色”区分。

> **B 端分析核心维度（对齐里程碑与最新指标）**：在可能情况下，务必补齐 `user.org_id`（公司/组织）与 `user.role`（角色），用于“事件/路径/人”三维对比。

#### 3.1 `trace_id` 的作用到底在哪里？
`trace_id` 对齐 `指标.md` 的 L2：**“路径与转化”**。
- 你文档里写的是：`路径发起量 = distinct(trace_id)`、完成率/步骤转化也是围绕 trace 计算的。
- 在微应用场景，用户会跨子应用跳转，如果只靠 `session_id` 或 `page_url`，路径会被切断，漏斗无法还原。

因此我们把 `trace_id` 定义为：**一次业务路径尝试的全局链路 ID**，例如“发起创建订单 -> 填写信息 -> 支付成功”这条链路，不管跨几个微应用都用同一个 `trace_id`。

#### 3.2 “染色区分”是什么意思？
“染色”是指在同一条 `session`（时间轴）里，用 `micro_app_id` 给事件打上“颜色标签”，从而：
- 你能在会话回放/时间轴里看到用户在 **哪个子应用** 做了哪些操作
- 当出现 L4 慢/错时，可以快速定位“问题发生在 A 子应用还是 B 子应用”

最直观的理解：
- **同一个 session_id** 里，事件按时间排序是“时间轴”
- 每条事件带一个 `micro_app_id`
- 看板把不同 `micro_app_id` 用不同颜色展示（这就叫“染色”）

#### 3.3 `trace_id / path_id / step_id / biz_id / journey_id` 的推荐生成与注入时机（MVP 可落地）
下面这部分是“按表施工”的工程指南：照着做就能确保 `指标.md` 的口径可算、且微应用不丢链路。

##### A. 字段职责速查（为什么要分这么多 ID）
- **`session.session_id`**：体验容器（L3）。回答“这一段连续使用里用户顺不顺”。会被空闲切分是正常的。
- **`session.trace_id`**：路径容器（L2）。回答“这次尝试能不能走完、在哪一步掉了”。
- **`session.path_id` / `session.step_id`**：漏斗定义（L2）。回答“步骤转化率、最大流失点”。
- **`biz.biz_id` / `biz.amount`**：价值锚点（L5）。回答“影响了哪些业务/多少钱”。
- **`session.journey_id`（可选）**：长旅程容器（L2/L5）。回答“跨多个 session 的长流程是否完成/是否损失”。

##### B. 什么时候生成（Trigger），在哪里存（Storage）
| 字段 | 生成时机（推荐） | 存储位置（推荐） | 生命周期 |
| :--- | :--- | :--- | :--- |
| `session_id` | 首次进入站点/首个事件触发；>30min 无交互后自动换新 | `sessionStorage`（同标签页）+ 备份 `localStorage`（可选） | 30min 滑动过期 |
| `trace_id` | **进入某条业务路径的“起点”**时生成（如点击“创建订单/开始办理”） | `sessionStorage`（与 session_id 同域） | 一次路径尝试（完成/放弃后结束） |
| `path_id` | 固定值：来自字典/配置（如 `order_pay_path`） | 不必存，随事件上报即可 | 长期稳定 |
| `step_id` | 进入步骤页面/点击下一步/提交表单等关键节点 | 不必存，随事件上报即可 | 每个步骤瞬时 |
| `biz_id` | **业务对象生成/获取到那一刻**（订单创建返回、合同号出现） | 可存到 `sessionStorage` 的“biz_context”里 | 直到路径结束或当天 |
| `journey_id`（可选） | 首次拿到 `biz_id` 或 path_start 时生成 | 可存 `localStorage`（按天） | 当天/24h |

##### C. 在微应用里怎么透传（Context Bridge 的 3 种做法）
MVP 选一种即可（按你们微前端框架能力）：

1) **Props 注入（推荐）**
- 基座在加载子应用时注入：`{ traceId, sessionId, journeyId, bizContext }`
- 子应用 SDK 初始化时优先读取 props 覆盖本地存储

2) **全局状态（如 qiankun globalState / microApp data）**
- 基座维护全局状态，子应用订阅变化（trace 更新/结束）

3) **URL 参数（兜底，不推荐长期用）**
- 跳转时在 URL 带 `?__trace=...&__sid=...`
- 子应用启动解析后立刻写入 storage 并从 URL 清理（避免泄露/污染分享链接）

##### D. `trace_id` 什么时候结束，什么时候复用？
为了让漏斗口径稳定，建议明确两类结束条件（MVP 必做其一即可）：
- **业务完成结束**：收到 `biz_outcome=success` 或 `path_step=end` → 清理当前 trace
- **业务放弃结束**：用户离开路径核心页面并超过 N 分钟未回到路径（例如 10min）→ 标记 abandon，清理 trace

复用规则：
- 用户在路径中跨微应用跳转：**必须复用同一 trace**
- 用户再次从起点重新发起：生成新的 trace（即使还是同一个 biz_id）

##### E. 如何把 `api_perf` 和业务/路径关联起来（L4 → L5 的关键）
只靠“接口慢”无法算 L5，必须把接口与“当时在做什么”关联：
- SDK 在发请求前读取当前上下文（`trace_id/session_id/biz_id/path_id/step_id`）
- 将这些字段写入 `api_perf` 事件（建议放在 `session.*` 与 `biz.*`）

可选增强（后续做）：在请求头里透传（方便后端日志/链路打通）
- `x-trace-id: <trace_id>`
- `x-session-id: <session_id>`
- `x-biz-id: <biz_id>`

##### F. 一套最小示例（你们研发可以照抄）
1) 用户点击“开始支付” → 生成 `trace_id`，上报 `path_step(start)`，并注入子应用
2) 子应用加载成功 → 上报 `page_view`（携带 trace）
3) 用户提交支付 → 上报 `path_step(confirm)` + `ui_click`
4) 发起支付接口 → 产生 `api_perf`（携带 trace + biz_id）
5) 支付成功回调 → 上报 `biz_outcome(success)` + `path_step(end)`，清理 trace

### 2. `session`（会话定义与口径）
**会话定义（MVP）**：同一用户在同一浏览器标签页内，连续操作间隔小于 30 分钟视为同一会话；超过 30 分钟无交互则开启新会话。

#### 4.1 你提到的情况：用户连续操作 4-5 小时，会变成 7-8 个会话吗？
不会“必然”变成 7-8 个会话，取决于这 4-5 小时里是否存在 >30min 的**长时间无交互**（午休/开会/离开页面）。
30min 规则切的是“用户停了多久”，不是“页面开了多久”。

但你提的担忧是对的：在一些业务里，用户可能 **长流程 + 中间长时间思考/等待**，会被切成多个 session，从而“会话维度”变碎。

#### 4.2 MVP 的推荐处理：Session + Journey 双层模型（不加太多复杂度）
为同时满足“会话统计”和“长流程连续性”，成熟方案通常会有两层：
- **session_id**：用于 L3 指标（重复操作率、操作间隔、停留等），天然会被空闲切断（更符合体验真实）
- **journey_id（建议新增，MVP 可选）**：用于把多个 session 串成一次更长的“业务旅程”

我们建议在 MVP 里引入一个非常轻量的 `journey_id`（不需要改变现有口径，也不影响 L1-L4）：
- 定义：同一 `user_id/anonymous_id` 在 24h 内、围绕同一 `biz_id` 或同一 `path_id` 的连续尝试，归为一个 journey
- 用途：
  - **L2/L5** 更关心“能不能走完/是否成功/损失金额”，journey 比 session 更稳定
  - 同一个用户分成多个 session 时，仍可在 journey 维度看到完整链路

#### 4.3 在数据上怎么落（最小字段）
在 envelope 增加（MVP 可先只在服务端 enrich 生成）：
- `session.journey_id`（string, optional）

生成规则（MVP 推荐）：
- 当 `biz.biz_id` 存在：`journey_id = hash(user_or_anonymous_id + biz_id + yyyy-mm-dd)`
- 当 `biz_id` 不存在但 `path_id` 存在：`journey_id = hash(user_or_anonymous_id + path_id + yyyy-mm-dd)`

这样你的 L5 价值分析（损失业务量/金额）可以用 `journey_id` 聚合，而 L3 体验指标仍用 `session_id` 聚合——两者不冲突。

| 字段 | 类型 | 必填 | 说明 | L 层级 | 来源 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `session.session_id` | string | Y | 会话 ID（滑动过期） | L2/L3/L5 | SDK |
| `session.session_start_ts` | number | Y | 会话开始时间戳 | L5 | SDK |
| `session.last_active_ts` | number | Y | 最后活跃时间戳 | L3 | SDK |
| `session.session_seq` | number | N | 用户当天第几次会话（可选） | L1 | SDK |
| `session.trace_id` | string | Y | **路径/链路 ID**（跨微应用不变） | L2/L4/L5 | SDK/容器 |
| `session.path_id` | string | N | 业务路径 ID（漏斗定义） | L2/L5 | SDK/业务 |
| `session.step_id` | string | N | 路径步骤 ID（用于步骤转化） | L2 | SDK/业务 |
| `session.prev_event_ts` | number | N | 上一个事件时间戳（算操作间隔） | L3 | SDK |

**如何覆盖 `指标.md` 的 L2/L3**：
- `路径发起量 = distinct(trace_id)`
- `步骤转化率 = step_n/step_(n-1)`（使用 `path_id + step_id + trace_id`）
- `操作间隔 = event.ts - session.prev_event_ts`
- `重复操作率 = rage_click_count / session`

### 3. `user`（用户标识与画像快照）
| 字段 | 类型 | 必填 | 说明 | L 层级 | 来源 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `user.user_id` | string | N | 登录用户 ID（可为空） | L1/L5 | 业务注入 |
| `user.anonymous_id` | string | Y | 匿名 ID（设备/浏览器维度） | L1 | SDK |
| `user.is_new_user` | boolean | N | 是否新用户（首次见） | L1 | server enrich |
| `user.role` | string | **建议 Y** | 角色（如 admin/员工/客户） | L1/L5 | server enrich |
| `user.org_id` | string | **建议 Y** | 组织/租户（公司维度） | L1/L5 | server enrich |
| `user.tags` | string[] | N | 标签（MVP 可选） | L5 | server enrich |

> MVP 只要求 `anonymous_id` + 可选 `user_id`。用户属性（画像）建议在服务端 enrich，避免前端写死。

### 4. `event`（事件本体：类型、语义、属性）

#### 4.1 事件类型枚举（MVP）
- `page_view`：页面访问（L1/L2）
- `page_leave`：页面离开（L3）
- `ui_click`：交互点击（L3）
- `ui_exposure`：元素曝光（L3）
- `ui_field`：表单字段交互（focus→blur，计算时长）（L3，可选增强，对齐里程碑“字段级监控”）
- `api_perf`：接口性能（L4，**MVP 可不采集，先用 ARMS**）
- `js_error`：前端异常（L4，**MVP 可不采集，先用 ARMS**）
- `path_step`：路径步骤（L2/L5）
- `biz_outcome`：业务结果（L5）

#### 5.1 这些事件类型“完整了吗”？
对 **MVP 的指标口径** 来说，这组类型是“够用且可控”的最小集合：它覆盖了 `指标.md` 里需要的页面、路径、交互、性能、错误、业务结果六大类。

但埋点系统里不存在“永远完整”的枚举。成熟系统的做法是：
- **协议层保持稳定**：不要频繁改大结构
- **通过字典扩展事件**：新增的“业务事件”通常是新增 `event.name`（在字典里定义），而不是新增一种 `event.type`

#### 5.2 以后新增事件类型怎么解决（推荐策略）
我们建议把 `event.type` 当作“一级大类”，只在出现“全新采集方式/全新指标域”时才新增。
新增通常有两种：

1) **新增事件（90% 的情况）**：只新增 `event_dictionary.code`
- 例：新增“导出报表点击”事件
- 做法：字典新增 `code=click_export_report`，`type=ui_click`，无需动协议

2) **新增事件类型（少数情况）**：新增一个 `event.type`
触发条件：它的数据结构与现有类型不兼容，或属于全新指标域。
- 例：未来你要做“录屏回放/用户操作序列压缩”，可能会新增 `replay_chunk`
- 做法：新增 `event.type=replay_chunk`，并在 `event` 下新增一个对应子对象（如 `event.replay`）

#### 5.3 为了可扩展，给 `event.type` 增加一个兜底规则（MVP 就能用）
允许 `event.type='custom'`（或 `custom_event`）：
- 约束：必须在字典里定义 `required_props`，并且 `event.props` 满足校验
- 用途：临时/试验性埋点先用 custom，不用立刻扩充枚举，避免协议频繁变更

| 字段 | 类型 | 必填 | 说明 | L 层级 | 来源 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `event.type` | string | Y | 事件类型（上面枚举） | ALL | SDK |
| `event.name` | string | Y | 事件编码（事件字典 code） | ALL | SDK/业务 |
| `event.ts` | number | Y | 事件发生时间戳 | ALL | SDK |
| `event.level` | 'L1'\\|'L2'\\|'L3'\\|'L4'\\|'L5' | Y | 事件归属层级（来自字典） | ALL | server verify |
| `event.props` | object | N | 事件自定义属性（键值对） | ALL | SDK/业务 |
| `event.element` | object | N | 元素信息（点击/曝光） | L3 | SDK |
| `event.page` | object | N | 页面信息（view/leave） | L2/L3 | SDK |
| `event.sample_rate` | number | N | 采样率（0-1） | L4 | SDK |
| `event.sdk` | object | Y | SDK 元信息 | ALL | SDK |

#### 4.2 `event.element`（用于 L3：重复操作、曝光点击率）
| 字段 | 类型 | 必填 | 说明 | 指标 |
| :--- | :--- | :--- | :--- | :--- |
| `event.element.id` | string | N | 业务定义的 element_id（推荐） | 复用性强 |
| `event.element.selector` | string | N | CSS selector（不稳定，慎用） | 调试 |
| `event.element.text` | string | N | 文本（可脱敏/截断） | 分析 |
| `event.element.rage_click` | boolean | N | 是否愤怒点击（阈值规则见后） | 重复操作率 |
| `event.element.exposure_id` | string | N | 曝光位 id（用于 CTR） | click/expose |

#### 4.3 `event.page`（用于 L3：停留时长）
| 字段 | 类型 | 必填 | 说明 | 指标 |
| :--- | :--- | :--- | :--- | :--- |
| `event.page.page_id` | string | N | 页面唯一 ID（可 hash(path+build)） | 汇总 |
| `event.page.enter_ts` | number | N | 进入时间（page_view） | 停留 |
| `event.page.leave_ts` | number | N | 离开时间（page_leave） | 停留 |
| `event.page.duration_ms` | number | N | 停留时长（leave-enter） | 页面停留时间 |
| `event.page.is_back` | boolean | N | 是否回退离开 | 回退率 |

#### 4.4 `event.field`（用于 L3：字段级操作间隔/犹豫时长，可选增强）
> 对齐里程碑“字段级监控：自动采集表单 focus 到 blur 的时长”。MVP 可以先只对带 `data-v-field-id` 的输入框生效，避免事件洪水。

| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `event.field.id` | string | N | 字段唯一标识（推荐：`data-v-field-id`） |
| `event.field.focus_ts` | number | N | focus 时间戳 |
| `event.field.blur_ts` | number | N | blur 时间戳 |
| `event.field.duration_ms` | number | N | blur - focus（字段停留/填写耗时） |

### 5. `perf`（性能与稳定，L4）
| 字段 | 类型 | 必填 | 说明 | 指标 |
| :--- | :--- | :--- | :--- | :--- |
| `perf.api` | object | N | 接口性能（api_perf） | 接口耗时/P95 |
| `perf.page` | object | N | 页面性能（page_view 可带） | 页面加载耗时 |
| `perf.error` | object | N | 错误信息（js_error） | 错误率 |

#### 5.1 `perf.api`（api_perf）
| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `perf.api.request_id` | string | N | 请求 ID（前端生成） |
| `perf.api.method` | string | Y | GET/POST |
| `perf.api.url` | string | Y | 请求 URL（建议去掉敏感 query） |
| `perf.api.duration_ms` | number | Y | 耗时 |
| `perf.api.status_code` | number | Y | 状态码 |
| `perf.api.is_slow` | boolean | Y | 是否慢请求（阈值规则来自字典/配置） |
| `perf.api.error_type` | 'timeout'\\|'network'\\|'http'\\|'abort'\\|'unknown' | N | 错误分类 |

#### 5.2 `perf.page`（page_view 可带）
| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `perf.page.fcp_ms` | number | N | First Contentful Paint |
| `perf.page.lcp_ms` | number | N | Largest Contentful Paint |
| `perf.page.ttfb_ms` | number | N | Time To First Byte |
| `perf.page.duration_ms` | number | N | 页面加载总耗时（你文档的 page_perf.duration） |

#### 5.3 `perf.error`（js_error）
| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `perf.error.name` | string | Y | 错误名 |
| `perf.error.message` | string | Y | 错误信息（可脱敏/截断） |
| `perf.error.stack` | string | N | stack（MVP 可选） |
| `perf.error.source` | 'window.onerror'\\|'unhandledrejection'\\|'console' | N | 来源 |

### 6. `biz`（业务对象与价值，L5 的关键）
| 字段 | 类型 | 必填 | 说明 | 对应指标 |
| :--- | :--- | :--- | :--- | :--- |
| `biz.biz_id` | string | N | 业务对象 ID（订单/合同/工单） | 完成量/完成率（对账键） |
| `biz.biz_type` | string | N | 业务类型（order/contract/…） | 维度拆分 |
| `biz.amount` | number | N | 金额（可选，V-Next 才用于“损失金额”） | V-Next |
| `biz.currency` | string | N | 币种（可选） | 展示 |
| `biz.outcome` | 'success'\\|'fail'\\|'abandon' | N | 业务结果（biz_outcome） | 完成量/完成率 |
| `biz.success_event` | string | N | 成功事件 name（用于追溯） | 完成量 |

---

## 四、事件字典（MVP 管理闭环）

> 事件字典是把“埋点”从代码行为升级为“可治理资产”的关键（减少沟通成本、统一口径、可追溯、可验收）。

### 1. `event_dictionary`（事件定义）最小字段
| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :--- | :--- |
| `code` | string | Y | 事件编码（唯一） |
| `name` | string | Y | 中文名（看板展示） |
| `level` | 'L1'\\|'L2'\\|'L3'\\|'L4'\\|'L5' | Y | **强制关联指标层级** |
| `type` | string | Y | 事件类型（page_view/ui_click/…） |
| `description` | string | N | 业务解释（口径） |
| `owner` | string | Y | 责任人/需求方 |
| `status` | 'draft'\\|'active'\\|'deprecated' | Y | 生命周期 |
| `version` | number | Y | 字典版本（发布快照） |
| `required_props` | object | N | 必填属性与类型约束 |
| `biz_rules` | object | N | L5 规则（biz_id/amount 字段名、成功事件名、窗口期等） |
| `perf_rules` | object | N | L4 规则（慢阈值、采样率等） |

### 2. `required_props` 示例（把“口径”固化）
```json
{
  "order_id": { "type": "string", "required": true },
  "pay_type": { "type": "string", "required": false, "enum": ["alipay", "wechat", "card"] },
  "amount": { "type": "number", "required": false, "min": 0 }
}
```

### 3. `biz_rules` 示例（对齐 `指标.md` 的 L5）
```json
{
  "biz_id_path": "biz.biz_id",
  "biz_amount_path": "biz.amount",
  "success_event_names": ["pay_success", "order_submit_success"],
  "loss_window_minutes": 30
}
```

### 4. 字典如何支撑 L5 的“效率指标”（MVP）
MVP 优先把“完成量/完成率/平均完成耗时/人效”算稳定：
- **完成量**：`count(distinct(trace_id) where biz_outcome=success)`（或按业务事实定义）
- **完成率**：`成功路径 / 总路径`
- **平均完成耗时**：`avg(path_end_ts - path_start_ts)`（P95 完成耗时按 V-Next）
- **人效**：`完成量 / 活跃用户`（支持按 org/role、功能/路径拆分）

> V-Next：如果要做“性能损失业务量/金额”，再引入 `biz_rules.loss_window_minutes`、`perf_rules.slow_threshold_ms` 等规则，并把 ARMS/自采的 L4 指标与 `biz_id` 关联。

---

## 五、MVP SDK 接口（对齐“声明式 + 代码式”）

### 1) 初始化
```javascript
Vtrack.init({
  appId: 'gds-share',
  env: 'staging',
  serverUrl: 'https://collector.xxx.com/collect',
  enableAutoPage: true,
  enableAutoPerf: true,
  enableAutoExposure: true,
  microApp: { enable: true, microAppId: 'sub-orders' }
});
```

### 2) 声明式埋点（MVP 推荐）
```html
<button
  data-v-track="click_order_pay"
  data-v-biz-id="ORD_20260113"
  data-v-biz-amount="500.00"
  data-v-element-id="pay_btn"
>
  立即支付
</button>
```

### 3) 代码埋点（业务复杂时）
```javascript
Vtrack.track('path_step', {
  path_id: 'order_pay_path',
  step_id: 'confirm',
  biz_id: orderId,
  amount: totalAmount,
});
```

---

## 六、后端落库与聚合口径（MongoDB）

### 1. `raw_events`（原始事件表，MVP）
- 索引建议：
  - `{ "session.session_id": 1, "event.ts": 1 }`（会话时间轴）
  - `{ "session.trace_id": 1, "event.ts": 1 }`（路径分析）
  - `{ "biz.biz_id": 1, "event.ts": 1 }`（L5 价值关联）
  - `{ "event.type": 1, "perf.api.is_slow": 1, "perf.api.status_code": 1 }`（性能）
- TTL：30 天（MVP 推荐），后续可把宽表长期保留、raw 短期保留。

### 2. 统计宽表（聚合表，支撑 Echarts）
- `event_metrics_daily`：按天 + app_id +（可选）org_id/role 聚合 L1（覆盖/使用/频次）
- `people_metrics_daily`：按天 + org_id/role 聚合 L1（活跃、覆盖、频次）
- `path_metrics_daily`：路径聚合（L2，后续阶段）
- `loss_metrics`：损失业务量/金额（L5，后续阶段）

---

## 七、参考资料（设计依据）
- [如何设计出一个实用高效的埋点管理系统？](https://www.woshipm.com/data-analysis/5107308.html)
- [如何设计企业级数据埋点采集方案？](https://www.cnblogs.com/bytedata/p/16695824.html)
- 阿里云 ARMS RUM 相关文档：
  - `https://help.aliyun.com/document_detail/252716.html`
  - `https://help.aliyun.com/document_detail/252718.html`
  - `https://help.aliyun.com/document_detail/327153.html`
  - `https://help.aliyun.com/document_detail/399751.html`
  - `https://help.aliyun.com/document_detail/2840363.html`
