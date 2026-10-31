UUID = icon-launcher@omakasui.org
EXTENSION_DIR = $(HOME)/.local/share/gnome-shell/extensions/$(UUID)
FILES = extension.js metadata.json icon.png prefs.js
SCHEMA_DIR = schemas
PO_DIR = po
POT_FILE = $(PO_DIR)/$(UUID).pot
PO_FILES = $(wildcard $(PO_DIR)/*.po)

# Compile po/<lang>.po into $(1)/locale/<lang>/LC_MESSAGES/$(UUID).mo
define compile-mo
@for po in $(PO_FILES); do \
	lang=$$(basename $$po .po); \
	mkdir -p $(1)/locale/$$lang/LC_MESSAGES; \
	msgfmt -o $(1)/locale/$$lang/LC_MESSAGES/$(UUID).mo $$po; \
done
endef

# Internal target for copying files
_copy-files:
	@mkdir -p $(EXTENSION_DIR)
	@cp $(FILES) $(EXTENSION_DIR)/
	@mkdir -p $(EXTENSION_DIR)/schemas
	@cp $(SCHEMA_DIR)/*.xml $(EXTENSION_DIR)/schemas/
	@glib-compile-schemas $(EXTENSION_DIR)/schemas/
	$(call compile-mo,$(EXTENSION_DIR))

.PHONY: install
install: _copy-files
	@gnome-extensions enable $(UUID) 2>/dev/null || true
	@echo "✓ Extension installed and enabled"
	@echo ""
	@echo "✓ Installed. Restart GNOME Shell, then: make enable"

.PHONY: dev
dev: _copy-files
	@echo "✓ Development installation complete"
	@echo ""
	@echo "✓ Installed. Restart GNOME Shell, then: make enable"

.PHONY: enable
enable:
	@gnome-extensions enable $(UUID)

.PHONY: disable
disable:
	@gnome-extensions disable $(UUID)

.PHONY: uninstall
uninstall:
	@echo "Uninstalling extension..."
	@gnome-extensions disable $(UUID) 2>/dev/null || true
	@gnome-extensions uninstall $(UUID) 2>/dev/null || true
	@rm -rf $(EXTENSION_DIR)
	@echo "✓ Extension uninstalled and removed"

.PHONY: build
build:
	@mkdir -p build
	@cp $(FILES) build/
	@mkdir -p build/schemas
	@cp $(SCHEMA_DIR)/*.xml build/schemas/
	$(call compile-mo,build)
	@cd build && zip -q -r ../$(UUID).shell-extension.zip *
	@rm -rf build
	@echo "✓ Created $(UUID).shell-extension.zip"

.PHONY: pot
pot:
	@xgettext --from-code=UTF-8 --language=JavaScript --keyword=_ \
		--package-name="Icon Launcher" --output=$(POT_FILE) extension.js prefs.js
	@echo "✓ Updated $(POT_FILE)"

.PHONY: update-po
update-po: pot
	@for po in $(PO_FILES); do \
		msgmerge --quiet --update --backup=none $$po $(POT_FILE); \
	done
	@echo "✓ Updated translations"

.PHONY: clean
clean:
	@rm -f $(UUID).shell-extension.zip
	@rm -rf build
	@echo "✓ Cleaned"