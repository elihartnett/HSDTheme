#!/bin/bash

set -e

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <THEMES_SOURCE> <OUTPUT_DESTINATION>"
    exit 1
fi

THEMES_SOURCE="$1"
OUTPUT_DESTINATION="$2"
DRIVER_DIRECTORY="$(dirname "${BASH_SOURCE[0]}")"
THEMES_DIRECTORY="$DRIVER_DIRECTORY/StyleDictionary/themes"

echo "$THEMES_SOURCE"
echo "$THEMES_DIRECTORY"

if [ ! -d "$THEMES_SOURCE" ]; then
    echo "Error: Source themes directory '$THEMES_SOURCE' does not exist."
    exit 1
fi

rm -rf "$THEMES_DIRECTORY"
mkdir -p "$THEMES_DIRECTORY"
cp -r "$THEMES_SOURCE"/. "$THEMES_DIRECTORY"/

npm --prefix "$DRIVER_DIRECTORY/StyleDictionary" install
npm --prefix "$DRIVER_DIRECTORY/StyleDictionary" run build

cp -r "$DRIVER_DIRECTORY/StyleDictionary/build/ios/SDThemer.swift" "$OUTPUT_DESTINATION"