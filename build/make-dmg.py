"""ReadFlow DMG 构建脚本（手动流程，确保背景图正确显示）。

electron-builder / dmgbuild 在本机生成的 .DS_Store 缺少 icvp(图标视图选项)
里的 backgroundImageAlias 记录，导致 Finder 不显示背景图。本脚本改用
hdiutil 创建可读写 DMG，再用 Python ds_store + mac_alias 直接写入正确的
.DS_Store（含 backgroundType=2 + 背景图别名 + 窗口布局 + 图标位置），
最后压缩为只读 UDZO。全程不打开 Finder，避免其用默认值覆盖。
"""
import json
import os
import shutil
import subprocess

APP_NAME = "ReadFlow"

PROJECT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RELEASE = os.path.join(PROJECT, "release")
APP_SRC = os.path.join(RELEASE, "mac", f"{APP_NAME}.app")
BG = os.path.join(PROJECT, "build", "dmg-background.png")

with open(os.path.join(PROJECT, "package.json"), encoding="utf-8") as f:
    VERSION = json.load(f)["version"]
VOLUME = f"{APP_NAME} {VERSION}"
OUT_DMG = os.path.join(RELEASE, f"{APP_NAME}-{VERSION}.dmg")

RW_DMG = "/tmp/readflow-build-rw.dmg"

DS_STORE_SCRIPT = r'''
from mac_alias import Alias
from ds_store import DSStore
import os

VOLUME = os.environ["RF_VOLUME"]
BG_NAME = ".background.png"
DS_STORE = os.path.join(VOLUME, ".DS_Store")

os.chdir(VOLUME)
alias = Alias.for_file(BG_NAME)

icvp = {
    "backgroundType": 2,
    "backgroundImageAlias": alias.to_bytes(),
    "backgroundColorRed": 0.0,
    "backgroundColorGreen": 0.0,
    "backgroundColorBlue": 0.0,
    "showIconPreview": True,
    "showItemInfo": False,
    "labelOnBottom": True,
    "textSize": 13,
    "iconSize": 80,
    "scrollOrigin": "{0, 0}",
    "gridSpacing": 100,
    "arrangeBy": "none",
    "gridOffsetX": 0,
    "gridOffsetY": 0,
}
bwsp = {
    "ShowStatusBar": False,
    "ShowToolbar": False,
    "ShowTabView": False,
    "ShowSidebar": False,
    "ShowPathbar": False,
    "WindowBounds": "{{400, 100}, {660, 440}}",
}

if os.path.exists(DS_STORE):
    os.remove(DS_STORE)
bgdir = os.path.join(VOLUME, ".background")
if os.path.isdir(bgdir):
    shutil.rmtree(bgdir)

with DSStore.open(DS_STORE, "w+") as d:
    d["."]["vSrn"] = ("long", 1)
    d["."]["bwsp"] = bwsp
    d["."]["icvp"] = icvp
    d["."]["icvl"] = ("long", 64)
    d["ReadFlow.app"]["Iloc"] = (180, 190)
    d["Applications"]["Iloc"] = (490, 190)
print("DS_Store written")
'''


def run(cmd, **kw):
    print("+", " ".join(cmd) if isinstance(cmd, list) else cmd)
    subprocess.run(cmd, shell=isinstance(cmd, str), check=True, **kw)


def main():
    assert os.path.exists(APP_SRC), f"App not found: {APP_SRC}"
    assert os.path.exists(BG), f"Background not found: {BG}"

    # 1. 可读写 DMG
    if os.path.exists(RW_DMG):
        os.remove(RW_DMG)
    run(["hdiutil", "create", "-volname", VOLUME, "-srcfolder", APP_SRC,
         "-ov", "-format", "UDRW", "-fs", "HFS+", RW_DMG])

    # 2. 挂载
    out = subprocess.run(["hdiutil", "attach", RW_DMG, "-nobrowse"],
                         capture_output=True, text=True, check=True)
    mpoint = None
    for line in out.stdout.splitlines():
        if line.strip().endswith(VOLUME):
            mpoint = "/Volumes/" + VOLUME
    assert mpoint, "Mount point not found"

    try:
        # 3. 应用快捷方式 + 背景图（扁平文件 .background.png）
        subprocess.run(["ln", "-sf", "/Applications", f"{mpoint}/Applications"], check=True)
        subprocess.run(["cp", BG, f"{mpoint}/.background.png"], check=True)
        # 4. 写入 DS_Store
        env = dict(os.environ, RF_VOLUME=mpoint)
        subprocess.run(["python3", "-c", DS_STORE_SCRIPT], env=env, check=True)
    finally:
        # 5. 卸载（不打开 Finder）
        subprocess.run(["hdiutil", "detach", mpoint, "-quiet"], check=True)

    # 6. 压缩为只读 DMG
    if os.path.exists(OUT_DMG):
        os.remove(OUT_DMG)
    run(["hdiutil", "convert", RW_DMG, "-format", "UDZO",
         "-imagekey", "zlib-level=9", "-o", OUT_DMG])
    os.remove(RW_DMG)

    size = os.path.getsize(OUT_DMG) / (1024 * 1024)
    print(f"\nDone: {OUT_DMG} ({size:.1f} MB)")


if __name__ == "__main__":
    main()
