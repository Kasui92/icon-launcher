# Icon Launcher

Add a customizable icon to the topbar that executes a command when clicked.

<div style="text-align: center">

![Screen Example](/.github/screen.png)

</div>

## Installation

Install from [GNOME Extensions](https://extensions.gnome.org/) or manually:

```bash
git clone https://github.com/Kasui92/icon-launcher.git
cd icon-launcher
make install
```

Restart GNOME Shell:
- **X11**: `Alt+F2` → `r` → Enter
- **Wayland**: logout/login

## Configuration

Open extension preferences to customize:
- Command to execute (leave empty to open app grid)
- Icon (PNG or SVG file)
- Icon size

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