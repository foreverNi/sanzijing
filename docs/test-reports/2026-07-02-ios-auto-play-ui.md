# iOS 自动播放锁屏 UI 测试报告

日期：2026-07-02

## 变更范围

- 优化 iOS 自动播放进入后的锁定界面。
- 自动播放锁定时全屏展示当前页插图。
- 屏幕底部展示锁定状态图标，长按该锁图标退出自动播放。
- 移除原居中弹框式“长按停止”提示。

## 静态与逻辑检查

- 检查 `ContentView.swift` 自动播放状态流：`startAutoMode()` 仍负责设置 `autoMode`、`locked` 和启动轮次。
- 退出路径仍复用 `stopAutoMode()`，保持取消待执行自动任务、解锁和停止音频的既有行为。
- 新增 UI 仅依赖当前页 `pageImage(_:)` 和 `currentPage.backgroundColor`，未改动内容数据、音频服务、录音服务和进度存储逻辑。
- 锁图标通过 `onLongPressGesture(minimumDuration: 0.9)` 退出，取消原弹框文案展示。

## 编译验证

命令：

```bash
xcodebuild -project ios/SanZijing.xcodeproj -scheme SanZijing -sdk iphoneos -destination generic/platform=iOS -configuration Debug -derivedDataPath /private/tmp/SanZijingAutoPlayUIDerivedData CODE_SIGNING_ALLOWED=NO build
```

结果：

- 沙箱内首次执行失败，失败点为 `LaunchScreen.storyboard` 的 `ibtool`/CoreSimulator 访问限制和 `iOS 26.5 Platform Not Installed` 环境错误。
- 提升权限后同命令执行成功，输出 `** BUILD SUCCEEDED **`。
- 构建保留既有 warning：`All interface orientations must be supported unless the app requires full screen.`

## 未覆盖项

- 未执行真机或模拟器手势测试；本轮验证覆盖编译、资源打包和静态逻辑路径。
