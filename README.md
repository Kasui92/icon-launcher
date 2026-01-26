# Icon Launcher

Add a customizable icon to the topbar that executes a command when clicked.

<div style="text-align: center">

![Screen Example](/.github/screen.png)

</div>

## Installation

- Download from the [Gnome Extension Website](https://extensions.gnome.org/extension/9134/icon-launcher/)
- Built by yourself:
```bash
git clone https://github.com/Kasui92/icon-launcher.git
cd icon-launcher
make install
```

## Configuration

Open extension preferences to customize:
- Command to execute (leave empty to open app grid)
- Icon (PNG or SVG file)
- Icon size
- Icon position (left/center/right)
- Icon location (0-100)
- Icon margin (left/right)

By default, clicking the icon opens the GNOME app grid.

## Development

```bash
make dev        # Install without enabling
make enable     # Enable extension
make disable    # Disable extension
```

## Commands

```bash
make install    # Install and enable
make uninstall  # Remove extension
make build      # Create .zip package
make clean      # Remove build files
```

## License

MIT License - see [LICENSE](LICENSE) file for details.
