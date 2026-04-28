# 待办清单 (Todo List)

一个基于纯 Web 技术（HTML/CSS/JS）实现的待办事项管理应用，可打包为 **Android APK** 和 **Windows EXE** 双平台运行。

## 功能概览

### 任务管理
- **创建任务** — 支持设置开始日期和截止日期
- **智能排序** — 任务按截止日期升序排列，未设日期的自动排在末尾
- **重复任务** — 支持每日 / 每周 / 每月 / 每年重复，任务完成时自动生成下一周期
- **逾期提醒** — 已逾期的截止日期会以红色高亮显示

### 便捷操作
- **编辑任务** — 点击编辑按钮，弹窗中修改任务内容、日期或重复类型
- **复制任务** — 一键复制已有任务，省去重复输入的麻烦
- **筛选列表** — 全部 / 进行中 / 已完成，快速切换视图
- **清除已完成** — 一键移除所有已完成任务

### 搜索与查找
- **关键词搜索** — 实时过滤任务文本
- **日期范围搜索** — 按开始/截止日期区间筛选
- 搜索条件与状态筛选可叠加使用

### 数据安全
- **可靠存储** — Android 使用系统原生 `SharedPreferences`，Windows 使用 `localStorage`，清除缓存不会丢数据
- **导出备份** — 导出为自包含 HTML 文件，可分享至其他应用或保存到本地
- **导入恢复** — 从备份 HTML 文件导入，支持替换当前数据或合并追加

### 界面体验
- 深色模式自适应（跟随系统设置）
- 全面屏 / 刘海屏安全区域适配
- 流畅的滑出删除动画
- 横屏 / 大屏响应式布局

## 技术架构

```
┌──────────────────────────────────────┐
│        www/index.html                │
│  纯 HTML + CSS + JS（单文件）         │
│  ~250 行 CSS  |  ~350 行 JS          │
└──────────┬───────────────────────────┘
           │
    ┌──────┴──────┐
    ▼              ▼
┌────────┐   ┌──────────┐
│ Capacitor │   │ Electron │
│ (Android) │   │ (Windows) │
└────────┘   └──────────┘
    ▼              ▼
   APK            EXE
```

- **前端**：纯 HTML + CSS + JavaScript，无框架、无构建工具
- **数据模型**：`{ id, text, done, startDate, endDate, isRecurring, recurringType, ... }`
- **Android 平台**：[Capacitor 7.x](https://capacitorjs.com/)，最低 Android 6.0 (API 23)
- **Windows 平台**：[Electron 33.x](https://www.electronjs.org/)，Windows 10+

---

## 下载安装

| 平台 | 文件 | 说明 |
|------|------|------|
| Android | `待办清单-v2.0.apk` | 直接安装到手机 |
| Windows | `待办清单 Setup x.x.x.exe` | NSIS 安装版，可选安装路径 |
| Windows | `待办清单 x.x.x.exe` | 便携版，直接运行无需安装 |

👉 [**前往 Releases 下载最新版本**](https://github.com/Columbina-Sublunar/todo-apk/releases/latest)

> 最低系统要求：Android 6.0+ / Windows 10+

---

## 项目结构

```
todo-apk/
├── www/
│   └── index.html              # 核心应用（HTML+CSS+JS，单文件）
├── android/                    # Android 原生项目 (Capacitor)
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/.../MainActivity.java
│   │       └── res/            # 图标、布局、样式
│   ├── build.gradle
│   └── build-apk.bat           # 一键构建 APK 脚本
├── desktop/                    # Windows 桌面项目 (Electron)
│   ├── main.js                 # Electron 主进程
│   ├── preload.js              # 安全预加载脚本
│   ├── package.json            # 依赖与 electron-builder 配置
│   └── patch.js                # Windows 构建兼容补丁
├── capacitor.config.json       # Capacitor 配置
├── package.json                # NPM 依赖（Android）
└── .gitignore
```

---

## 本地开发

### 环境要求

- [Node.js](https://nodejs.org/) 18+

### Android 构建

额外需要：
- [Android Studio](https://developer.android.com/studio)（含 Android SDK 35）
- Gradle 8.11.1（通过 `gradlew` 自动下载）

```bash
# 1. 安装依赖
npm install

# 2. 同步 Web 资源到 Android
npx cap sync

# 3. 用 Gradle 构建 APK
cd android
./gradlew assembleDebug
# 或 Windows 上双击运行 build-apk.bat
```

### Windows 桌面构建

无需额外工具链。

```bash
# 1. 进入桌面项目目录
cd desktop

# 2. 安装依赖（自动执行 patch.js 处理 Windows 兼容）
npm install

# 3. 开发测试
npm start

# 4. 构建 EXE
npm run build
```

构建产物在 `desktop/dist/`：
- `待办清单 Setup x.x.x.exe` — NSIS 安装版
- `待办清单 x.x.x.exe` — 便携版

### 调试 Web 层

在浏览器中直接打开 `www/index.html` 即可调试大部分功能。插件相关功能（存储、导出、状态栏）需在实际 App 环境中测试。

## 平台差异

| 功能 | Android (Capacitor) | Windows (Electron) |
|------|-------------------|-------------------|
| 数据存储 | SharedPreferences | localStorage |
| 导出分享 | 系统分享面板 | 浏览器下载 |
| 状态栏 | 沉浸式着色 | 无（桌面不需要） |
| 窗口大小 | 全屏 | 480×800 可调 |

> 同一份 `www/index.html` 代码，零平台适配改动。所有平台差异通过 try/catch 降级自动处理。

## 许可证

MIT License
