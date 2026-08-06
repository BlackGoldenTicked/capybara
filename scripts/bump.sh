#!/usr/bin/env bash
# ReadFlow 版本发布流程：
# 每次修改代码后，将 package.json 的 semver patch 位 +1（如 0.7.36 -> 0.7.37），
# 并将当前全部改动提交到 git（commit message 形如 "vX.Y.Z 本次改动简述"，
# 沿用仓库既有风格；只 commit，不打 tag、不 push）。
#
# 用法：
#   bash scripts/bump.sh "本次改动简述"
#
# 注意：本脚本执行 git commit 后，会由 .git/hooks/post-commit 钩子
#       自动触发完整构建并安装（bash build/post-dev.sh），无需手动构建。
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
