#!/bin/bash

# usage:
#           ./build.sh --module <namamodule>
#           ./build.sh --all
#

BUILD_ALL=false

# 1. Ambil argumen menggunakan flag
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --module) MODULE_NAME="$2"; shift ;;
        --all) BUILD_ALL=true ;;
        *) echo "Argumen tidak dikenal: $1"; exit 1 ;;
    esac
    shift
done

# 2. Logika Eksekusi
if [ "$BUILD_ALL" = true ]; then
    echo "Memulai build untuk SEMUA module..."
    # Mencari semua file config rollup di dalam folder modules
    for config in ./public/modules/*/__rollup.*.js; do
        if [ -f "$config" ]; then
            echo "Building: $config"
            npx rollup -c "$config"
        fi
    done

elif [ -n "$MODULE_NAME" ]; then
    # 3. Definisikan path file config rollup untuk satu module
    CONFIG_PATH="./public/modules/${MODULE_NAME}/__rollup.${MODULE_NAME}.js"

    # 4. Cek apakah file config tersebut ada sebelum eksekusi
    if [ -f "$CONFIG_PATH" ]; then
        echo "Memulai build untuk module: $MODULE_NAME..."
        npx rollup -c "$CONFIG_PATH"
    else
        echo "Error: File konfigurasi tidak ditemukan di $CONFIG_PATH"
        exit 1
    fi
else
    # Jika tidak ada argumen yang valid
    echo "Error: Gunakan --module <namamodule> atau --all"
    echo "Cara pakai: ./build.sh --module namamodule"
    echo "            ./build.sh --all"
    exit 1
fi