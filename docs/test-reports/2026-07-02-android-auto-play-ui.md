# Android 自动播放锁屏 UI 测试报告

日期：2026-07-02

## 变更范围

- 将 Android 自动播放锁定界面同步为全屏展示当前页插图。
- 屏幕底部展示锁定状态图标，长按该锁图标退出自动播放。
- 取消原“三指按住左上、右上、下方中央解锁”的文字提示和区域判断。

## 静态与逻辑检查

- `startAutoMode()` 仍负责进入自动播放、保持屏幕常亮、设置锁定状态并启动自动播放轮次。
- 退出仍复用 `stopAutoMode()`，保持取消自动翻页任务、取消解锁任务、停止 TTS/音频和恢复按钮文本的既有行为。
- 锁屏图片从 `assets/illustrations/page_xxx.png` 读取，并在 `renderPage()` 与 `setLocked()` 时同步到覆盖层。
- 锁定覆盖层会吞掉非锁按钮触摸，避免自动播放锁定时底层页面继续响应滑动或点击。

## 编译与测试

命令：

```bash
gradle assembleDebug
gradle testDebugUnitTest
adb devices
```

结果：

- 沙箱内 Gradle 首次执行失败，失败点为 Gradle native service 加载本机缓存受限。
- 提升权限后 `gradle assembleDebug` 成功，输出 `BUILD SUCCESSFUL`。
- 提升权限后 `gradle testDebugUnitTest` 成功，结果为 `NO-SOURCE`，当前项目没有可执行单元测试。
- `adb devices` 提升权限后可执行，但当前无已连接设备或运行中的模拟器。

## 未覆盖项

- 未执行 Android 模拟器或真机长按锁图标的动态 UI 测试，原因是当前没有可用设备。
