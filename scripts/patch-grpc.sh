#!/bin/bash
# Patch iotex-antenna to use @grpc/grpc-js instead of deprecated grpc
ANTENNA_RPC="node_modules/iotex-antenna/lib/rpc-method/node-rpc-method.js"
if [ -f "$ANTENNA_RPC" ]; then
  sed -i.bak 's|require("grpc")|require("@grpc/grpc-js")|g' "$ANTENNA_RPC"
  sed -i.bak 's|var _grpc = _interopRequireDefault(require("@grpc/grpc-js"));|var _grpc = {default: require("@grpc/grpc-js")};|' "$ANTENNA_RPC"
  rm -f "${ANTENNA_RPC}.bak"
  echo "Patched iotex-antenna grpc -> @grpc/grpc-js"
fi
