#!/usr/bin/env bash
# Capybara 版本发布流程：
# 每次修改代码后，将 package.json 的 semver patch 位 +1（如 0.7.192 -> 0.7.193），
# 并将当前全部改动提交到 git（commit message 形如 "vX.Y.Z 本次改动简述"，
# 沿用仓库既有风格；只 commit，不打 tag、不 push）。
# 提交后由 .git/hooks/post-commit 钩子后台触发完整构建并安装
# （nohup 脱离会话，提交终端/Agent 会话中途退出构建也不受影响）；
# 本脚本会轮询构建进程并实时透传日志直至完成。
#
# 用法：
#   bash scripts/bump.sh "本次改动简述"
set -euo pipefail
cd "$(dirname "$0")/.."

if [ $# -lt 1 ]; then
  echo "用法: bash scripts/bump.sh \"本次改动简述\"" >&2
  exit 1
fi
DESC="$1"

OLD=$(node -p "require('./package.json').version")
NEW=$(node -e "const v=require('./package.json').version.split('.');v[2]=String(Number(v[2])+1);console.log(v.join('.'))")

# 仅修改 version 字段，保留其余内容与 2 空格缩进、末尾换行
node -e "const fs=require('fs');const p='./package.json';const j=JSON.parse(fs.readFileSync(p,'utf8'));j.version='$NEW';fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n')"

# 提交全部改动（受 .gitignore 约束，不会纳入 node_modules/release/out 等）
git add -A
git commit -m "v$NEW $DESC"

echo "版本 $OLD -> $NEW 已提交"

# ---- 等待 post-commit 钩子触发的后台构建完成，并实时透传日志 ----
LOG=/tmp/capybara-post-dev.log
PIDFILE=/tmp/capybara-post-dev.pid
log_lines() {
  local n
  n=$(wc -l < "$LOG" 2>/dev/null | tr -d '[:space:]' || true)
  echo "${n:-0}"
}
PID=0
for _ in $(seq 1 25); do
  P="$(cat "$PIDFILE" 2>/dev/null || true)"
  if [ -n "$P" ] && kill -0 "$P" 2>/dev/null; then PID="$P"; break; fi
  sleep 0.2
done
if [ "$PID" != "0" ]; then
  echo
  echo "==> 自动构建已启动（pid $PID），实时输出："
  SHOWN=0
  while kill -0 "$PID" 2>/dev/null; do
    TOTAL=$(log_lines)
    if [ "$TOTAL" -gt "$SHOWN" ] 2>/dev/null; then
      sed -n "$((SHOWN+1)),${TOTAL}p" "$LOG"
      SHOWN=$TOTAL
    fi
    sleep 1
  done
  TOTAL=$(log_lines)
  if [ "$TOTAL" -gt "$SHOWN" ] 2>/dev/null; then
    sed -n "$((SHOWN+1)),${TOTAL}p" "$LOG"
  fi
  echo
  if tail -5 "$LOG" | grep -q '✅'; then
    echo "==> ✅ v$NEW 构建安装完成，新版本已启动"
  else
    echo "==> ❌ v$NEW 构建流程未成功完成，完整日志： tail -60 $LOG"
    exit 1
  fi
else
  echo "(post-commit 未触发自动构建：本次提交未涉及源码/构建文件，或已有构建在运行)"
fi
