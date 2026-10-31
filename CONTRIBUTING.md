# Contributing

## Translations

Translations live in `po/` and require `gettext`.

```bash
make pot        # Regenerate po/icon-launcher@omakasui.org.pot
make update-po  # Merge the template into every po/<lang>.po
```

To add a language, copy the template to `po/<lang>.po` (e.g. `po/de.po`), translate it, then open a pull request.
