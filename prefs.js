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

    // Icon Group
    const iconGroup = new Adw.PreferencesGroup({
      title: "Icon",
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

    // Command Group
    const commandGroup = new Adw.PreferencesGroup({
      title: "Command",
    });

    // Custom Command
    const commandRow = new Adw.EntryRow({
      title: "Custom Command",
    });
    commandRow.set_show_apply_button(false);
    commandRow.set_text("");
    commandRow.set_enable_emoji_completion(false);

    // Add description to the group instead
    commandGroup.set_description("Command to execute when clicking the icon. Leave empty to open app grid (default)");

    const commandClearButton = new Gtk.Button({
      icon_name: "edit-clear-symbolic",
      valign: Gtk.Align.CENTER,
      tooltip_text: "Clear custom command",
    });

    commandRow.add_suffix(commandClearButton);
    commandGroup.add(commandRow);

    // Position Group
    const positionGroup = new Adw.PreferencesGroup({
      title: "Position",
    });

    // Panel Position ComboRow
    const positionRow = new Adw.ComboRow({
      title: "Panel Position",
      subtitle: "Choose where the icon appears in the top bar",
    });

    const positionModel = new Gtk.StringList();
    positionModel.append("Left");
    positionModel.append("Center");
    positionModel.append("Right");
    positionRow.set_model(positionModel);

    // Map current setting to combo box selection
    const currentPosition = settings.get_string("panel-position");
    const positionMap = { left: 0, center: 1, right: 2 };
    positionRow.set_selected(positionMap[currentPosition] || 0);

    // Handle selection changes
    positionRow.connect("notify::selected", () => {
      const selected = positionRow.get_selected();
      const positions = ["left", "center", "right"];
      settings.set_string("panel-position", positions[selected]);
    });

    positionGroup.add(positionRow);

    // Icon Location
    const locationRow = new Adw.ActionRow({
      title: "Location",
      subtitle: "Adjust the icon location within the selected panel position",
    });

    const locationAdjustment = new Gtk.Adjustment({
      lower: 0,
      upper: 100,
      step_increment: 1,
    });

    const locationSpinButton = new Gtk.SpinButton({
      adjustment: locationAdjustment,
      valign: Gtk.Align.CENTER,
    });

    locationRow.add_suffix(locationSpinButton);
    positionGroup.add(locationRow);

    // Margin Left
    const marginLeftRow = new Adw.ActionRow({
      title: "Left Margin",
      subtitle: "Left margin in pixels (0-50)",
    });

    const marginLeftAdjustment = new Gtk.Adjustment({
      lower: 0,
      upper: 50,
      step_increment: 1,
      page_increment: 5,
    });

    const marginLeftSpinButton = new Gtk.SpinButton({
      adjustment: marginLeftAdjustment,
      valign: Gtk.Align.CENTER,
    });

    marginLeftRow.add_suffix(marginLeftSpinButton);
    positionGroup.add(marginLeftRow);

    // Margin Right
    const marginRightRow = new Adw.ActionRow({
      title: "Right Margin",
      subtitle: "Right margin in pixels (0-50)",
    });

    const marginRightAdjustment = new Gtk.Adjustment({
      lower: 0,
      upper: 50,
      step_increment: 1,
      page_increment: 5,
    });

    const marginRightSpinButton = new Gtk.SpinButton({
      adjustment: marginRightAdjustment,
      valign: Gtk.Align.CENTER,
    });

    marginRightRow.add_suffix(marginRightSpinButton);
    positionGroup.add(marginRightRow);

    // Restore to defaults
    const resetGroup = new Adw.PreferencesGroup({
      title: "Reset Preferences",
      description: "Clear all custom settings and restore default values",
    });

    // Create button with icon and text
    const resetButtonBox = new Gtk.Box({
      spacing: 6,
    });
    resetButtonBox.set_margin_start(20);
    resetButtonBox.set_margin_end(20);
    resetButtonBox.set_margin_top(6);
    resetButtonBox.set_margin_bottom(6);

    const resetIcon = new Gtk.Image({
      icon_name: "edit-undo-symbolic",
    });
    resetIcon.set_margin_end(6);

    const resetLabel = new Gtk.Label({
      label: "Reset",
    });

    resetButtonBox.append(resetIcon);
    resetButtonBox.append(resetLabel);

    const resetButton = new Gtk.Button({
      halign: Gtk.Align.START,
      valign: Gtk.Align.CENTER,
      child: resetButtonBox,
      css_classes: ["circular", "destructive-action"],
    });

    resetButton.connect("clicked", () => {
      settings.reset("custom-icon-path");
      settings.reset("custom-command");
      settings.reset("icon-size");
      settings.reset("panel-position");
      settings.reset("location");
      settings.reset("margin-left");
      settings.reset("margin-right");
    });

    resetGroup.set_header_suffix(resetButton);

    // Add groups to page
    page.add(iconGroup);
    page.add(commandGroup);
    page.add(positionGroup);
    page.add(resetGroup);
    window.add(page);

    // Bindings
    settings.bind(
      "icon-size",
      sizeSpinButton,
      "value",
      Gio.SettingsBindFlags.DEFAULT
    );

    settings.bind(
      "location",
      locationSpinButton,
      "value",
      Gio.SettingsBindFlags.DEFAULT
    );

    settings.bind(
      "margin-left",
      marginLeftSpinButton,
      "value",
      Gio.SettingsBindFlags.DEFAULT
    );

    settings.bind(
      "margin-right",
      marginRightSpinButton,
      "value",
      Gio.SettingsBindFlags.DEFAULT
    );

    settings.bind(
      "custom-command",
      commandRow,
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

    // Clear command button
    commandClearButton.connect("clicked", () => {
      settings.set_string("custom-command", "");
    });
  }
}
