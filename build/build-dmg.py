"""Build Capybara DMG with proper background image using dmgbuild."""
import os

APPLICATION_NAME = "Capybara"
VERSION = "0.7.21"
VOLUME_NAME = f"{APPLICATION_NAME} {VERSION}"

# Script is in build/; project root is one level up
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD_DIR = os.path.join(PROJECT_DIR, "build")
RELEASE_DIR = os.path.join(PROJECT_DIR, "release")
APP_PATH = os.path.join(RELEASE_DIR, "mac", f"{APPLICATION_NAME}.app")
BG_IMAGE = os.path.join(BUILD_DIR, "dmg-background.png")
OUTPUT_DMG = os.path.join(RELEASE_DIR, f"{APPLICATION_NAME}-{VERSION}.dmg")

SETTINGS = {
    'files': [APP_PATH],
    'symlinks': {'Applications': '/Applications'},
    'background': BG_IMAGE,
    'window_rect': ((400, 100), (660, 440)),
    'icon_size': 128,
    'text_size': 13,
    'icon_locations': {
        f'{APPLICATION_NAME}.app': (165, 150),
        'Applications': (455, 150),
    },
    'show_status_bar': False,
    'show_tab_view': False,
    'show_toolbar': False,
    'arrangement': 'none',
}

def build():
    import dmgbuild
    print(f"Building {VOLUME_NAME} DMG...")
    print(f"  Project:   {PROJECT_DIR}")
    print(f"  Background: {BG_IMAGE}")
    print(f"  Exists?     {os.path.exists(BG_IMAGE)}")
    print(f"  App:        {APP_PATH}")
    print(f"  Exists?     {os.path.exists(APP_PATH)}")
    print(f"  Output:     {OUTPUT_DMG}")

    assert os.path.exists(BG_IMAGE), f"Background not found: {BG_IMAGE}"
    assert os.path.exists(APP_PATH), f"App not found: {APP_PATH}"
    
    # Ensure output dir exists
    os.makedirs(RELEASE_DIR, exist_ok=True)
    
    dmgbuild.build_dmg(
        OUTPUT_DMG,
        VOLUME_NAME,
        settings=SETTINGS,
        lookForHiDPI=True,
    )
    size_mb = os.path.getsize(OUTPUT_DMG) / (1024 * 1024)
    print(f"Done! DMG size: {size_mb:.1f} MB")

if __name__ == '__main__':
    build()
