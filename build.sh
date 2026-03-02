#!/bin/bash


# usege:
#           ./build.sh --module <namamodule>
#
# 1. Ambil argumen menggunakan flag --module
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --module) MODULE_NAME="$2"; shift ;;
        *) echo "Argumen tidak dikenal: $1"; exit 1 ;;
    esac
    shift
done

# 2. Cek apakah nama module sudah diisi
if [ -z "$MODULE_NAME" ]; then
    echo "Error: Nama module harus diisi."
    echo "Cara pakai: ./build.sh --module namamodule"
    exit 1
fi

# 3. Definisikan path file config rollup
CONFIG_PATH="./public/modules/${MODULE_NAME}/__rollup.${MODULE_NAME}.js"

# 4. Cek apakah file config tersebut ada sebelum eksekusi
if [ -f "$CONFIG_PATH" ]; then
    echo "Memulai build untuk module: $MODULE_NAME..."
    npx rollup -c "$CONFIG_PATH"
else
    echo "Error: File konfigurasi tidak ditemukan di $CONFIG_PATH"
    exit 1
fi