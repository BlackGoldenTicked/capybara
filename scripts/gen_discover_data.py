#!/usr/bin/env python3
"""
Capybara 信源发现数据生成脚本（可复现）。
从项目 feeds/ 目录解析 rss_sources_insert.sql（RSS 源）+ ddl.sql（65 角色），
生成 src/main/discover/data.ts（紧凑 TS 模块），并推导 role_source_map 角色映射。

用法：
    python3 scripts/gen_discover_data.py
输出：
    src/main/discover/data.ts
"""
import re
import json
import os
from collections import OrderedDict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FEEDS_DIR = os.path.join(ROOT, "feeds")
SQL_PATH = os.path.join(FEEDS_DIR, "rss_sources_insert.sql")
SCHEMA_PATH = os.path.join(FEEDS_DIR, "ddl.sql")
OUT_PATH = os.path.join(ROOT, "src", "main", "discover", "data.ts")

# ==================== 一、解析 ddl.sql 的 65 角色 ====================
schema = open(SCHEMA_PATH, encoding="utf-8").read()
role_rows = re.findall(
    r"\('([^']+)',\s*'([^']+)',\s*'((?:[^']|'')*)'\)",
    schema.split("INSERT INTO roles")[1].split(";")[0],
)
roles = []  # (name, domain, description)
for name, domain, desc in role_rows:
    roles.append((name.replace("''", "'"), domain, desc.replace("''", "'")))
print(f"解析角色: {len(roles)} 条")
role_names = set(n for n, _, _ in roles)

# ==================== 二、解析 rss_sources_insert.sql ====================
sql = open(SQL_PATH, encoding="utf-8").read()
sources = []  # [title, xml_url, html_url, source_type, tier, stars, tags(list), language, description]
for line in sql.splitlines():
    m = re.search(r"INSERT INTO rss_sources \(.*?\) VALUES \((.*)\);", line)
    if not m:
        continue
    body = m.group(1)
    fields = re.findall(r"'((?:[^']|'')*)'|(\d+)", body)
    vals = []
    for f in fields:
        vals.append(f[0].replace("''", "'") if f[0] else f[1])
    if len(vals) >= 9:
        try:
            tags = json.loads(vals[6])
        except Exception:
            tags = []
        sources.append([vals[0], vals[1], vals[2], vals[3], vals[4], int(vals[5]), tags, vals[7], vals[8]])
print(f"解析源: {len(sources)} 条")

# ==================== 三、角色映射推导规则 ====================
# tag → 相关角色名（按角色 name 精确匹配 roles 表）
TAG_TO_ROLES = {
    "科技": ["AI/ML工程师", "数据工程师", "全栈工程师", "科技记者/编辑", "普通群众", "技术管理者/CTO"],
    "编程开发": ["前端工程师", "后端工程师", "全栈工程师", "移动端工程师", "AI/ML工程师",
                 "DevOps/SRE", "安全工程师", "游戏开发工程师", "QA/测试工程师", "技术文档工程师", "技术管理者/CTO"],
    "设计创意": ["产品经理", "UI设计师", "UX研究员", "工业设计师", "品牌/视觉设计师", "内容创作者/自媒体"],
    "创业商业": ["创业者", "投资人/VC/PE", "市场营销/增长", "运营经理", "商业分析师", "管理咨询顾问", "HR/招聘"],
    "学术科研": ["AI/计算机研究者", "医学/生物研究者", "自然科学研究者", "社会科学研究者", "高校教师/教授", "博士生/硕士生"],
    "财经金融": ["二级市场投资者", "投资人/VC/PE", "财务/会计/审计", "商业分析师"],
    "影视娱乐": ["影视/音乐/戏剧人", "内容创作者/自媒体"],
    "音乐播客": ["内容创作者/自媒体", "影视/音乐/戏剧人"],
    "时政新闻": ["公务员/体制内", "政策研究/智库", "法律从业者", "普通群众"],
    "游戏电竞": ["游戏开发工程师", "影视/音乐/戏剧人"],
    "职场效率": ["HR/招聘", "运营经理", "内容创作者/自媒体", "普通群众"],
    "阅读写作": ["文学/出版从业者", "内容创作者/自媒体"],
}

# description 大分类 → 相关角色名
DESC_TO_ROLES = {
    "前端与 Web 开发": ["前端工程师", "全栈工程师", "技术文档工程师"],
    "后端·架构·运维·云": ["后端工程师", "DevOps/SRE", "技术管理者/CTO", "全栈工程师"],
    "编程语言": ["后端工程师", "前端工程师", "全栈工程师", "AI/计算机研究者"],
    "移动开发": ["移动端工程师", "全栈工程师"],
    "人工智能与数据科学": ["AI/ML工程师", "AI/计算机研究者", "数据工程师"],
    "开源·极客·社区": ["全栈工程师", "后端工程师", "DevOps/SRE", "技术管理者/CTO", "AI/ML工程师"],
    "科技媒体与资讯": ["科技记者/编辑", "普通群众", "AI/ML工程师"],
    "产品·设计·UX": ["产品经理", "UI设计师", "UX研究员", "工业设计师", "品牌/视觉设计师"],
    "创业·投资·财经": ["创业者", "投资人/VC/PE", "二级市场投资者", "财务/会计/审计", "商业分析师", "管理咨询顾问"],
    "科学·学术·研究": ["AI/计算机研究者", "自然科学研究者", "社会科学研究者", "高校教师/教授"],
    "新闻·时政·国际": ["政策研究/智库", "公务员/体制内", "法律从业者", "普通群众"],
    "游戏·影视·音乐·娱乐": ["游戏开发工程师", "影视/音乐/戏剧人", "内容创作者/自媒体"],
    "播客·视频": ["内容创作者/自媒体", "影视/音乐/戏剧人"],
    "职场·效率·写作·阅读": ["HR/招聘", "运营经理", "文学/出版从业者", "内容创作者/自媒体"],
    "综合·个人博客": ["普通群众", "自由职业者"],
    "中文资讯·公众号": ["普通群众", "科技记者/编辑", "传统行业从业者"],
}

# 校验：规则里引用的角色名必须存在于 roles 表
for tag, rl in TAG_TO_ROLES.items():
    for r in rl:
        assert r in role_names, f"TAG_TO_ROLES[{tag}] 引用不存在的角色: {r}"
for desc, rl in DESC_TO_ROLES.items():
    for r in rl:
        assert r in role_names, f"DESC_TO_ROLES[{desc}] 引用不存在的角色: {r}"

# 生成 role_source_map：[(roleIndex, sourceIndex, priority)]
role_index = {name: i for i, (name, _, _) in enumerate(roles)}
role_map = OrderedDict()  # (roleIndex, sourceIndex) -> priority
for si, src in enumerate(sources):
    title, xml_url, html_url, source_type, tier, stars, tags, lang, desc = src
    matched = set()
    for t in tags:
        for r in TAG_TO_ROLES.get(t, []):
            matched.add(role_index[r])
    for r in DESC_TO_ROLES.get(desc, []):
        matched.add(role_index[r])
    # 权威源（T0/T1）额外关联研究者/记者角色，确保一手源被专业角色覆盖
    if tier in ("T0", "T1"):
        for extra in ("AI/计算机研究者", "科技记者/编辑", "AI/ML工程师"):
            if extra in role_index:
                matched.add(role_index[extra])
    if not matched:
        continue
    priority = "必选" if tier in ("T0", "T1") else "选配"
    for ri in matched:
        role_map[(ri, si)] = priority

print(f"role_source_map: {len(role_map)} 对映射")

# ==================== 四、生成 TS 文件 ====================
def ts_str(s: str) -> str:
    # 转义为 TS 字符串字面量
    return json.dumps(s, ensure_ascii=False)

lines = []
lines.append("// 自动生成，勿手改。来源：项目 feeds/ 目录 rss_sources_insert.sql + ddl.sql")
lines.append("// 重新生成：python3 scripts/gen_discover_data.py")
lines.append("")
lines.append("export interface DiscoverRole { name: string; domain: string; description: string }")
lines.append("")
lines.append("export const DISCOVER_ROLES: DiscoverRole[] = [")
for name, domain, desc in roles:
    lines.append(f"  {{ name: {ts_str(name)}, domain: {ts_str(domain)}, description: {ts_str(desc)} }},")
lines.append("];")
lines.append("")
lines.append("// [title, xml_url, html_url, source_type, tier, stars, tags, language, description]")
lines.append("export const DISCOVER_SOURCES: Array<[string, string, string, string, string, number, string[], string, string]> = [")
for src in sources:
    title, xml_url, html_url, source_type, tier, stars, tags, lang, desc = src
    lines.append(
        f"  [{ts_str(title)}, {ts_str(xml_url)}, {ts_str(html_url)}, {ts_str(source_type)}, {ts_str(tier)}, {stars}, {json.dumps(tags, ensure_ascii=False)}, {ts_str(lang)}, {ts_str(desc)}],"
    )
lines.append("];")
lines.append("")
lines.append("// [roleIndex, sourceIndex, priority]  priority: '必选' | '选配'")
lines.append("export const ROLE_SOURCE_MAP: Array<[number, number, string]> = [")
for (ri, si), priority in role_map.items():
    lines.append(f"  [{ri}, {si}, {ts_str(priority)}],")
lines.append("];")
lines.append("")

open(OUT_PATH, "w", encoding="utf-8").write("\n".join(lines))
import os
print(f"已生成: {OUT_PATH}  ({os.path.getsize(OUT_PATH)} bytes)")
