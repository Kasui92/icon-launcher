# Icon Launcher

Add a customizable icon to the topbar that executes a command when clicked.

## Installation

Install from [GNOME Extensions](https://extensions.gnome.org/) or manually:

```bash
git clone https://github.com/Kasui92/icon-launcher.git
cd icon-launcher
make local
```

Restart GNOME Shell:
- **X11**: `Alt+F2` → `r` → Enter
- **Wayland**: logout/login

## Configuration

Open extension preferences to customize:
- Command to execute
- Icon (SVG file)
- Icon size and spacing
- Position in topbar

## Development

```bash
make dev        # Install without enabling
make enable     # Enable extension
make logs       # Show real-time logs
```

## Commands

```bash
make local      # Install and enable
make uninstall  # Remove extension
make build      # Create .zip package
make clean      # Remove build files
```

## License

MIT License - see [LICENSE](LICENSE) file for details.