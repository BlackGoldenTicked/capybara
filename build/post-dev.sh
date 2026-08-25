#!/usr/bin/env bash
# =============================================================
# Capybara 开发完标准收尾流程（一键执行）
# 用法： bash build/post-dev.sh
# 流程：① 关掉所有运行中的 Capybara / dev 进程
#      ② 清理历史构建产物与 DMG 挂载残留
#      ③ 自动构建（electron-vite → electron-builder → DMG）
#      ④ 打开 /Applications/Capybara.app
# =============================================================
set -o pipefail

APP="/Applications/Capybara.app"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR" || exit 1

echo "==> 项目目录: $PROJECT_DIR"
echo

# ============================================================
echo "==> [1/4] 关闭所有运行中的 Capybara / dev 进程"
# 优雅退出（若已安装并正在运行）
osascript -e 'tell application "Capybara" to quit' 2>/dev/null || true
# 强杀残留（含 dev server：electron-vite / vite）
# 注意：进程名是 "Capybara"（大写 R），pkill -f capybara 小写匹配不到，必须大写
pkill -9 -f "Capybara"  2>/dev/null || true
pkill -f electron-vite  2>/dev/null || true
pkill -f "vite"         2>/dev/null || true
sleep 1
echo "    已发送退出信号，等待 1s"
echo

# ============================================================
echo "==> [2/4] 清理历史构建产物与挂载残留"
# 卸载之前构建/预览残留的 DMG 卷（否则 make-dmg 会拿不到干净挂载点）
for m in /Volumes/Capybara*; do
  if [ -d "$m" ]; then
    hdiutil detach "$m" -force -quiet 2>/dev/null && echo "    detached $m" || echo "    (跳过 $m)"
  fi
done
rm -f /tmp/capybara-build-rw.dmg 2>/dev/null || true
# 删除可再生的构建产物（out=编译缓存，release/mac=打包 app，release/*.dmg=旧安装包）
rm -rf "$PROJECT_DIR/out"            2>/dev/null || true
rm -rf "$PROJECT_DIR/release/mac"    2>/dev/null || true
rm -f  "$PROJECT_DIR"/release/*.dmg  2>/dev/null || true
echo "    已清理 out/ release/mac/ 旧 DMG 与挂载残留"
echo "    （注意：不删除 .capybara-userData 与 ~/Library 下的生产数据库）"
echo

# ============================================================
echo "==> [3/4] 自动构建（electron-vite → electron-builder → DMG）"
npm run build 2>&1 | tail -8
echo "    --- 打包 macOS app (dir) ---"
./node_modules/.bin/electron-builder --mac --dir 2>&1 | tail -12
# 硬卡点：electron-builder 必须产出 app，否则后续安装全是空操作
# （之前正是因 electron 二进制下载失败，release/mac/Capybara.app 未生成，安装被静默跳过）
if [ ! -d "$PROJECT_DIR/release/mac/Capybara.app" ]; then
  echo "    ✗✗✗ 致命：electron-builder 未产出 release/mac/Capybara.app，构建失败"
  echo "       常见原因：electron 二进制（~115MB）下载失败/超时。请排查网络后重跑本脚本。"
  echo "       （本步仅告警不退出，最终版本校验会再次拦截；沙箱钩子构建本就不落真实盘，属预期）"
fi
echo "    --- 生成 DMG ---"
python3 build/make-dmg.py 2>&1 | tail -12
echo

# ============================================================
echo "==> [4/4] 安装并打开程序"
# 把刚构建的 app 覆盖安装到 /Applications，保证「运行的」就是「刚构建的」版本
# （彻底杜绝之前反复出现的「旧二进制 / 旧副本」问题）
if [ -d "$PROJECT_DIR/release/mac/Capybara.app" ]; then
  echo "    安装最新构建 → $APP (ditto 合并覆盖，避免 bulk-delete 弹窗)"
  # 先彻底退出运行中的实例，释放文件句柄，否则 ditto 写入可能失败
  pkill -9 -f "Capybara" 2>/dev/null || true
  sleep 2
  /usr/bin/ditto "$PROJECT_DIR/release/mac/Capybara.app" "$APP"
  xattr -dr com.apple.quarantine "$APP" 2>/dev/null || true
  echo "    ditto 安装完成"

  # ============================================================
  # Dock 图标缓存失效（无需手动 killall Dock）
  # macOS 按「应用路径 + 图标路径」缓存 Dock/Cmd+Tab 渲染结果；
  # 改了 logo PNG 的「字节」但文件名不变时，系统不重新读取 → 显示旧图标。
  # 这里做变更感知：仅当 build/logos 内容真的变了才刷新缓存（重启 Dock），
  # 无关构建不打扰用户。重启 Dock <1s，已打开窗口不受影响。
  LOGO_SRC="$PROJECT_DIR/build/logos"
  HASH_FILE="$PROJECT_DIR/.logo_cache_hash"
  if [ -d "$LOGO_SRC" ]; then
    NEW_HASH="$(find "$LOGO_SRC" -type f -name '*.png' -exec md5 -q {} \; 2>/dev/null | md5 -q 2>/dev/null || echo none)"
  else
    NEW_HASH="none"
  fi
  OLD_HASH="$(cat "$HASH_FILE" 2>/dev/null || echo none)"
  if [ "$NEW_HASH" != "$OLD_HASH" ]; then
    echo "    检测到 logo 图标变更 → 刷新系统图标缓存（重启 Dock）"
    touch "$APP" 2>/dev/null || true
    /System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$APP" >/dev/null 2>&1 || true
    killall Dock 2>/dev/null || true
    echo "$NEW_HASH" > "$HASH_FILE"
  else
    echo "    logo 未变更，跳过图标缓存刷新"
  fi
else
  echo "    ⚠ 未找到刚构建的 $PROJECT_DIR/release/mac/Capybara.app（第三步构建可能失败）"
fi
if [ -d "$APP" ] && [ -f "$APP/Contents/Info.plist" ]; then
  open "$APP"
  # 前台激活，确保窗口跳到最前（未签名 app 默认可能躲在后面）
  osascript -e 'tell application "Capybara" to activate' 2>/dev/null || true
  echo "    已打开并前台激活 $APP（标题栏应为最新版本号）"
else
  echo "    ⚠ 未找到 $APP"
fi
echo

# ============================================================
# 最终校验：已安装版本必须与 package.json 一致，否则就是「构建/安装没生效」
BUILT_VER="$(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' "$APP/Contents/Info.plist" 2>/dev/null)"
PKG_VER="$(grep -m1 '"version"' package.json | sed -E 's/.*"version"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')"
if [ "$BUILT_VER" = "$PKG_VER" ]; then
  echo "==> ✅ 安装校验通过：已装 $BUILT_VER == package.json $PKG_VER"
else
  echo "==> ❌❌❌ 安装校验失败：已装「$BUILT_VER」≠ package.json「$PKG_VER」"
  echo "    说明构建或安装未生效（很可能是 electron 二进制下载失败导致 release/mac/Capybara.app 未生成）。"
  echo "    请排查网络后重跑： bash build/post-dev.sh"
  exit 1
fi
