#!/usr/bin/env bash
# Create a video project folder from a template.
#   new_project.sh <project-dir> <template>
# templates: kinetic-text | product-ad | explainer | logo-intro | blank
set -euo pipefail
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
dir="${1:?project dir}"; tpl="${2:-blank}"
src="$SKILL_DIR/assets/templates/$tpl.html"
[[ -f "$src" ]] || { echo "unknown template: $tpl ($(ls "$SKILL_DIR/assets/templates" | sed 's/.html//' | tr '\n' ' '))"; exit 1; }
mkdir -p "$dir"
cp -r "$SKILL_DIR/assets/fonts" "$dir/"
cp "$SKILL_DIR/assets/mg.js" "$SKILL_DIR/assets/stage.css" "$SKILL_DIR/assets/brand.css" "$dir/"
# brand files (logo etc.) the user has stored with the skill
[[ -d "$SKILL_DIR/assets/brand" ]] && cp -r "$SKILL_DIR/assets/brand/." "$dir/"
[[ -f "$dir/index.html" ]] && { echo "$dir/index.html exists, not overwriting"; exit 1; }
cp "$src" "$dir/index.html"
echo "created $dir/index.html from $tpl"
