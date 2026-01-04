import St from "gi://St";
import GObject from "gi://GObject";
import Gio from "gi://Gio";
import GLib from "gi://GLib";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

const TopbarButton = GObject.registerClass(
  class TopbarButton extends PanelMenu.Button {
    _init(extensionPath, settings) {
      super._init(0.0, "Topbar Icon", false);

      this._settings = settings;
      this._extensionPath = extensionPath;

      // Remove all default styling and behavior
      this.remove_style_class_name("panel-button");
      this.style = "padding: 0; margin: 0 0 0 14px;";
      this.reactive = true;
      this.can_focus = false;
      this.track_hover = false;

      // Create icon
      this._icon = this._createIcon();

      let box = new St.Bin({
        style: "padding: 0; margin: 0 0 0 0;",
        child: this._icon,
      });

      this.add_child(box);

      // Force icon color to white
      this._icon.set_style("-st-icon-style: symbolic;");
      this._icon.add_style_class_name("system-status-icon");

      this.connect("button-press-event", () => {
        this._executeCommand();
        return true;
      });

      // Listen for settings changes (only relevant keys)
      this._settingsChangedIds = [];
      this._settingsChangedIds.push(
        this._settings.connect("changed::custom-icon-path", () =>
          this._updateIcon()
        )
      );
      this._settingsChangedIds.push(
        this._settings.connect("changed::icon-size", () => this._updateIcon())
      );
    }

    _createIcon() {
      const customIconPath = this._settings.get_string("custom-icon-path");
      const iconSize = this._settings.get_int("icon-size");

      let iconPath = customIconPath || this._extensionPath + "/icon.png";

      // Check if file exists
      if (
        customIconPath &&
        !GLib.file_test(customIconPath, GLib.FileTest.EXISTS)
      ) {
        console.warn(`Custom icon not found: ${customIconPath}, using default`);
        iconPath = this._extensionPath + "/icon.png";
      }

      let gicon = Gio.icon_new_for_string(iconPath);

      return new St.Icon({
        gicon: gicon,
        icon_size: iconSize,
      });
    }

    _updateIcon() {
      const customIconPath = this._settings.get_string("custom-icon-path");
      const iconSize = this._settings.get_int("icon-size");

      let iconPath = customIconPath || this._extensionPath + "/icon.png";

      if (
        customIconPath &&
        !GLib.file_test(customIconPath, GLib.FileTest.EXISTS)
      ) {
        console.warn(`Custom icon not found: ${customIconPath}, using default`);
        iconPath = this._extensionPath + "/icon.png";
      }

      const gicon = Gio.icon_new_for_string(iconPath);
      this._icon.set_gicon(gicon);
      this._icon.set_icon_size(iconSize);
    }

    _executeCommand() {
      try {
        const commandString = this._settings.get_string("custom-command");

        // If no custom command is set, open app grid as default
        if (!commandString || commandString.trim() === "") {
          Main.overview.show();
          Main.overview.dash.showAppsButton.checked = true;
          return;
        }

        // Parse command string into array
        const command = GLib.shell_parse_argv(commandString)[1];

        Gio.Subprocess.new(command, Gio.SubprocessFlags.NONE);
      } catch (e) {
        console.error("Command execution error:", e);
      }
    }

    destroy() {
      if (this._settingsChangedIds) {
        this._settingsChangedIds.forEach((id) => this._settings.disconnect(id));
        this._settingsChangedIds = null;
      }

      if (this._icon) {
        this._icon = null;
      }

      this._settings = null;
      super.destroy();
    }
  }
);

export default class IconLauncherExtension extends Extension {
  enable() {
    this._settings = this.getSettings();
    this._button = new TopbarButton(this.path, this._settings);

    Main.panel.addToStatusArea("icon-launcher", this._button, 0, "left");
  }

  disable() {
    if (this._button) {
      this._button.destroy();
      this._button = null;
    }

    if (this._settings) {
      this._settings = null;
    }
  }
}
