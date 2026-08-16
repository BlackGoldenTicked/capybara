import json

src = "/Users/zhangyu/Desktop/NewMax.app/theme_tokens.json"
out = "/Users/zhangyu/WorkBuddy/root/readflow/src/renderer/src/styles/themes.css"

with open(src, encoding="utf-8") as f:
    data = json.load(f)

lines = []
lines.append("/* ============================================================")
lines.append("   NewMax 预设主题色板 —— 自动生成自 theme_tokens.json")
lines.append("   - light 态：html[data-theme=\"X\"]")
lines.append("   - dark 态：html[data-theme=\"X\"].dark")
lines.append("   - image-wallpaper 依赖背景图资源（aqua-curves/petal-haze），")
lines.append("     本项目无该资源，故不生成（其 light/dark 为空对象）。")
lines.append("   ============================================================ */")
lines.append("")

for name, modes in data.items():
    if name == "image-wallpaper":
        continue
    light = modes.get("light", {})
    dark = modes.get("dark", {})
    if not light and not dark:
        continue
    if light:
        lines.append(f'html[data-theme="{name}"] {{')
        for k, v in light.items():
            lines.append(f"  {k}: {v};")
        lines.append("}")
        lines.append("")
    if dark:
        lines.append(f'html[data-theme="{name}"].dark {{')
        for k, v in dark.items():
            lines.append(f"  {k}: {v};")
        lines.append("}")
        lines.append("")

with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

theme_count = sum(1 for n in data if n != "image-wallpaper")
print(f"generated {out}")
print(f"themes: {theme_count}, total lines: {len(lines)}")
