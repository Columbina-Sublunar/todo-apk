# 待办清单 (Todo APK)

一个基于 [Capacitor](https://capacitorjs.com/) 构建的跨平台待办事项管理应用，以纯 Web 技术（HTML/CSS/JS）实现业务逻辑，通过 Capacitor 打包为原生 Android APK。

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
- **可靠存储** — 使用系统原生 `SharedPreferences` 存储数据，清除 App 缓存不会丢数据
- **导出备份** — 导出为自包含 HTML 文件，可分享至其他应用或保存到本地
- **导入恢复** — 从备份 HTML 文件导入，支持替换当前数据或合并追加

### 界面体验
- 深色模式自适应（跟随系统设置）
- 全面屏 / 刘海屏安全区域适配
- 流畅的滑出删除动画
- 横屏 / 大屏响应式布局

## 技术架构

```
Capacitor 原生壳
  └── MainActivity (extends BridgeActivity)
        └── WebView (全屏)
              └── www/index.html  ← 整个应用逻辑（单文件）
                    ├── 内联 CSS（~250 行）
                    └── 内联 JS（~350 行）
```

- **前端**：纯 HTML + CSS + JavaScript，无框架、无构建工具
- **数据模型**：`{ id, text, done, startDate, endDate, isRecurring, recurringType, ... }`
- **跨平台方案**：[Capacitor 7.x](https://capacitorjs.com/)
- **原生平台**：Android（Gradle 8.11.1, AGP 8.7.2）
- **最低 SDK**：Android 6.0 (API 23)
- **目标 SDK**：Android 15 (API 35)

## 使用的 Capacitor 插件

| 插件 | 用途 |
|------|------|
| `@capacitor/status-bar` | 设置沉浸式状态栏颜色 |
| `@capacitor/preferences` | 数据持久化存储 |
| `@capacitor/share` | 导出时调用系统分享面板 |

## 项目结构

```
todo-apk/
├── www/
│   └── index.html              # 核心应用（HTML+CSS+JS）
├── android/                    # Android 原生项目
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/.../MainActivity.java
│   │       └── res/            # 图标、布局、样式
│   ├── build.gradle
│   ├── settings.gradle
│   └── variables.gradle
├── capacitor.config.json       # Capacitor 配置
├── package.json                # NPM 依赖
└── .gitignore
```

## 本地开发

### 环境要求

- [Node.js](https://nodejs.org/) 18+
- [Android Studio](https://developer.android.com/studio) (含 Android SDK 35)
- Gradle 8.11.1（通过 `gradlew` 自动下载）

### 开发步骤

```bash
# 1. 克隆仓库
git clone https://github.com/Columbina-Sublunar/todo-apk.git
cd todo-apk

# 2. 安装依赖
npm install

# 3. 同步 Web 资源到 Android
npx cap sync

# 4. 在 Android Studio 中打开并运行
npx cap open android

# 或者直接用 Gradle 构建
cd android
./gradlew assembleDebug
```

### 调试 Web 层

在浏览器中直接打开 `www/index.html` 即可调试大部分功能。插件相关功能（存储、导出、状态栏）需在实际 Android 环境中测试。

## 下载安装

前往 [Releases](https://github.com/Columbina-Sublunar/todo-apk/releases) 页面下载最新 APK。

> 📦 最低系统要求：Android 6.0+

## 许可证

MIT License
