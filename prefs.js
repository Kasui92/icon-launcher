import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import Gio from "gi://Gio";
import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class IconLauncherPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();

    const page = new Adw.PreferencesPage({
      title: "General",
      icon_name: "dialog-information-symbolic",
    });

    // Icon Settings Group
    const iconGroup = new Adw.PreferencesGroup({
      title: "Icon Settings",
      description: "Customize the topbar icon appearance",
    });

    // Custom Icon Path
    const iconRow = new Adw.ActionRow({
      title: "Custom Icon",
      subtitle: "Select a custom PNG or SVG icon (leave empty for default)",
    });

    const iconButton = new Gtk.Button({
      label: "Choose Icon",
      valign: Gtk.Align.CENTER,
    });

    const iconClearButton = new Gtk.Button({
      icon_name: "edit-clear-symbolic",
      valign: Gtk.Align.CENTER,
      tooltip_text: "Clear custom icon",
    });

    const iconBox = new Gtk.Box({
      spacing: 6,
      valign: Gtk.Align.CENTER,
    });
    iconBox.append(iconButton);
    iconBox.append(iconClearButton);

    iconRow.add_suffix(iconBox);
    iconGroup.add(iconRow);

    // Icon path label
    const iconPathLabel = new Gtk.Label({
      label: settings.get_string("custom-icon-path") || "Default icon",
      wrap: true,
      xalign: 0,
      margin_start: 12,
      margin_end: 12,
      margin_top: 6,
      margin_bottom: 6,
    });
    iconPathLabel.add_css_class("dim-label");
    iconPathLabel.add_css_class("caption");
    iconGroup.add(iconPathLabel);

    // Icon Size
    const sizeRow = new Adw.ActionRow({
      title: "Icon Size",
      subtitle: "Size in pixels (8-32)",
    });

    const sizeAdjustment = new Gtk.Adjustment({
      lower: 8,
      upper: 32,
      step_increment: 1,
      page_increment: 4,
    });

    const sizeSpinButton = new Gtk.SpinButton({
      adjustment: sizeAdjustment,
      valign: Gtk.Align.CENTER,
    });

    sizeRow.add_suffix(sizeSpinButton);
    iconGroup.add(sizeRow);

    // Command Settings Group
    const commandGroup = new Adw.PreferencesGroup({
      title: "Command Settings",
      description: "Customize the command executed on click",
    });

    // Custom Command
    const commandRow = new Adw.ActionRow({
      title: "Command",
      subtitle: "Command to execute when clicking the icon",
    });

    const commandEntry = new Gtk.Entry({
      valign: Gtk.Align.CENTER,
      hexpand: true,
      placeholder_text: "Leave empty to open app grid",
    });

    commandRow.add_suffix(commandEntry);
    commandGroup.add(commandRow);

    // Info message box
    const infoBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      margin_top: 12,
      margin_bottom: 6,
    });

    const infoFrame = new Gtk.Frame({
      css_classes: ["card"],
    });

    const infoContent = new Gtk.Box({
      orientation: Gtk.Orientation.HORIZONTAL,
      spacing: 12,
      margin_top: 12,
      margin_bottom: 12,
      margin_start: 12,
      margin_end: 12,
    });

    const infoIcon = new Gtk.Image({
      icon_name: "dialog-warning-symbolic",
      valign: Gtk.Align.CENTER,
    });
    infoIcon.add_css_class("dim-label");

    const infoTextBox = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
      spacing: 6,
      hexpand: true,
    });

    const infoTitle = new Gtk.Label({
      label: "Changes require restarting GNOME Shell:",
      wrap: true,
      xalign: 0,
    });
    infoTitle.add_css_class("dim-label");

    const xorgLabel = new Gtk.Label({
      label: "  • Xorg: Alt+F2 → type 'r' → Enter",
      wrap: true,
      xalign: 0,
    });
    xorgLabel.add_css_class("dim-label");
    xorgLabel.add_css_class("caption");

    const waylandLabel = new Gtk.Label({
      label: "  • Wayland: Logout and login",
      wrap: true,
      xalign: 0,
    });
    waylandLabel.add_css_class("dim-label");
    waylandLabel.add_css_class("caption");

    infoTextBox.append(infoTitle);
    infoTextBox.append(xorgLabel);
    infoTextBox.append(waylandLabel);

    infoContent.append(infoIcon);
    infoContent.append(infoTextBox);
    infoFrame.set_child(infoContent);
    infoBox.append(infoFrame);
    commandGroup.add(infoBox);

    // Add groups to page
    page.add(iconGroup);
    page.add(commandGroup);
    window.add(page);

    // Bindings
    settings.bind(
      "icon-size",
      sizeSpinButton,
      "value",
      Gio.SettingsBindFlags.DEFAULT
    );

    settings.bind(
      "custom-command",
      commandEntry,
      "text",
      Gio.SettingsBindFlags.DEFAULT
    );

    // Icon file chooser
    iconButton.connect("clicked", () => {
      const dialog = new Gtk.FileDialog({
        title: "Select Icon",
        modal: true,
      });

      const filter = new Gtk.FileFilter();
      filter.set_name("Image Files");
      filter.add_mime_type("image/svg+xml");
      filter.add_mime_type("image/png");
      filter.add_pattern("*.svg");
      filter.add_pattern("*.png");

      const filterStore = new Gio.ListStore({ item_type: Gtk.FileFilter });
      filterStore.append(filter);
      dialog.set_filters(filterStore);

      dialog.open(window, null, (source, result) => {
        try {
          const file = dialog.open_finish(result);
          if (file) {
            const path = file.get_path();
            settings.set_string("custom-icon-path", path);
          }
        } catch (e) {
          if (!e.matches(Gtk.DialogError, Gtk.DialogError.DISMISSED)) {
            console.error("Error selecting file:", e);
          }
        }
      });
    });

    // Clear icon button
    iconClearButton.connect("clicked", () => {
      settings.set_string("custom-icon-path", "");
    });

    // Update label when settings change
    settings.connect("changed::custom-icon-path", () => {
      const path = settings.get_string("custom-icon-path");
      iconPathLabel.set_label(path || "Default icon");
    });
  }
}
