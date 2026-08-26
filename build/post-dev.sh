#!/usr/bin/env bash
# =============================================================
# Capybara 开发完标准收尾流程（一键执行）
# 用法： bash build/post-dev.sh
# 流程：① 关掉所有运行中的 Capybara / dev 进程
#      ② 清理历史构建产物与 DMG 挂载残留
#      ③ 自动构建（electron-vite → electron-builder → DMG）
#      ④ 安装到 /Applications 并打开
# 原则：任何一步失败都立即退出（exit 1），绝不打开旧版 app「假装成功」。
#      可由 .git/hooks/post-commit 后台触发（nohup 脱离会话，会话被杀构建照常完成），
#      也可手动执行。日志：/tmp/capybara-post-dev.log
# =============================================================
set -o pipefail

APP="/Applications/Capybara.app"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR" || exit 1

PID_FILE="/tmp/capybara-post-dev.pid"
LOG_FILE="/tmp/capybara-post-dev.log"

# ---- 单实例守卫：同一时刻只允许一个构建流程（防止并发构建互相清目录/杀进程）----
if [ -f "$PID_FILE" ]; then
  OLD_PID="$(cat "$PID_FILE" 2>/dev/null || echo 0)"
  if [ -n "$OLD_PID" ] && [ "$OLD_PID" != "0" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "==> 已有构建进程在运行（pid $OLD_PID），本次跳过。跟踪：tail -f $LOG_FILE"
    exit 1
  fi
fi
echo $$ > "$PID_FILE"

echo "==> 项目目录: $PROJECT_DIR"
echo "==> 开始时间: $(date '+%H:%M:%S')"
echo

# ============================================================
echo "==> [1/4] 关闭所有运行中的 Capybara / dev 进程"
# 优雅退出（若已安装并正在运行）
osascript -e 'tell application "Capybara" to quit' 2>/dev/null || true
# 强杀残留的已安装实例（用完整 .app 路径做匹配，避免误杀命令行里恰好含 Capybara 字样的其他进程）
pkill -9 -f "Capybara.app" 2>/dev/null || true
# 强杀 dev server 残留（electron-vite / vite）
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
echo

# ============================================================
echo "==> [3/4] 自动构建（electron-vite → electron-builder → DMG）"
if ! npm run build 2>&1 | tail -30; then
  echo "    ✗✗✗ 致命：electron-vite build 失败（上方为输出末尾），流程终止"
  rm -f "$PID_FILE"
  exit 1
fi
echo "    --- 打包 macOS app (dir) ---"
if ! ./node_modules/.bin/electron-builder --mac --dir 2>&1 | tail -15; then
  echo "    ✗✗✗ 致命：electron-builder 失败（上方为输出末尾），流程终止"
  rm -f "$PID_FILE"
  exit 1
fi
# 硬卡点：app 必须产出且结构完整（Info.plist + app.asar 双检，拦截半成品 bundle）
RELEASE_APP="$PROJECT_DIR/release/mac/Capybara.app"
if [ ! -f "$RELEASE_APP/Contents/Info.plist" ] || [ ! -f "$RELEASE_APP/Contents/Resources/app.asar" ]; then
  echo "    ✗✗✗ 致命：electron-builder 未产出完整的 release/mac/Capybara.app，流程终止"
  echo "       常见原因：electron 二进制（~115MB）下载失败/超时、磁盘空间不足。排查后重跑： bash build/post-dev.sh"
  rm -f "$PID_FILE"
  exit 1
fi
echo "    --- 生成 DMG ---"
python3 build/make-dmg.py 2>&1 | tail -12 || echo "    ⚠ DMG 生成失败（不影响 app 安装，可稍后单独重跑 python3 build/make-dmg.py）"
echo

# ============================================================
echo "==> [4/4] 安装并打开程序"
# 先彻底退出运行中的实例，释放文件句柄，否则 ditto 写入可能失败
if pkill -9 -f "Capybara.app" 2>/dev/null; then sleep 2; fi
INSTALLED=0
if /usr/bin/ditto "$RELEASE_APP" "$APP"; then
  xattr -dr com.apple.quarantine "$APP" 2>/dev/null || true
  INSTALLED=1
  echo "    ditto 安装完成 → $APP"
else
  echo "    ✗✗✗ 致命：ditto 安装失败（/Applications 不可写或旧实例未退出），流程终止"
  rm -f "$PID_FILE"
  exit 1
fi

# ============================================================
# Dock 图标缓存失效（logo 变更感知：仅 build/logos 内容变化时触发，无关构建不打扰用户）
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

# 只有本次确实安装成功才打开新 app（杜绝「打开旧版 app 假装成功」的假阳性）
if [ "$INSTALLED" = "1" ]; then
  open "$APP"
  # 前台激活（带超时：app 首次启动慢时不阻塞收尾，激活失败不影响安装结果）
  timeout 5 osascript -e 'tell application "Capybara" to activate' 2>/dev/null || true
  echo "    已打开并前台激活 $APP"
fi
echo

# ============================================================
# 最终校验：已安装版本必须与 package.json 一致，否则就是「构建/安装没生效」
BUILT_VER="$(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' "$APP/Contents/Info.plist" 2>/dev/null)"
PKG_VER="$(grep -m1 '"version"' package.json | sed -E 's/.*"version"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')"
rm -f "$PID_FILE"
if [ "$BUILT_VER" = "$PKG_VER" ]; then
  echo "==> ✅ 安装校验通过：已装 $BUILT_VER == package.json $PKG_VER"
  exit 0
else
  echo "==> ❌❌❌ 安装校验失败：已装「$BUILT_VER」≠ package.json「$PKG_VER」"
  echo "    说明构建或安装未生效，请查看完整日志： tail -80 $LOG_FILE"
  exit 1
fi
