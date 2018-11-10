// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright (c) 2018 IoTeX
// This is an alpha (internal) release and is not suitable for production. This source code is provided 'as is' and no
// warranties are given as to title or non-infringement, merchantability or fitness for purpose and, to the extent
// permitted by law, all liability for your use of the code is disclaimed. This source code is governed by Apache
// License 2.0 that can be found in the LICENSE file.
//
// To compile the proto, run:
// cd ../wallet-core-protos
// npm install -g grpc-tools
// grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../ --grpc_out=../ --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` rpc.proto
'use strict';
var grpc = require('grpc');
var rpc_pb = require('./rpc_pb.js');

function serialize_pb_DecodeAddressRequest(arg) {
  if (!(arg instanceof rpc_pb.DecodeAddressRequest)) {
    throw new Error('Expected argument of type pb.DecodeAddressRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_DecodeAddressRequest(buffer_arg) {
  return rpc_pb.DecodeAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_DecodeAddressResponse(arg) {
  if (!(arg instanceof rpc_pb.DecodeAddressResponse)) {
    throw new Error('Expected argument of type pb.DecodeAddressResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_DecodeAddressResponse(buffer_arg) {
  return rpc_pb.DecodeAddressResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_NewWalletRequest(arg) {
  if (!(arg instanceof rpc_pb.NewWalletRequest)) {
    throw new Error('Expected argument of type pb.NewWalletRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_NewWalletRequest(buffer_arg) {
  return rpc_pb.NewWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_NewWalletResponse(arg) {
  if (!(arg instanceof rpc_pb.NewWalletResponse)) {
    throw new Error('Expected argument of type pb.NewWalletResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_NewWalletResponse(buffer_arg) {
  return rpc_pb.NewWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_SignCreateDepositRequest(arg) {
  if (!(arg instanceof rpc_pb.SignCreateDepositRequest)) {
    throw new Error('Expected argument of type pb.SignCreateDepositRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_SignCreateDepositRequest(buffer_arg) {
  return rpc_pb.SignCreateDepositRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_SignCreateDepositResponse(arg) {
  if (!(arg instanceof rpc_pb.SignCreateDepositResponse)) {
    throw new Error('Expected argument of type pb.SignCreateDepositResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_SignCreateDepositResponse(buffer_arg) {
  return rpc_pb.SignCreateDepositResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_SignExecutionRequest(arg) {
  if (!(arg instanceof rpc_pb.SignExecutionRequest)) {
    throw new Error('Expected argument of type pb.SignExecutionRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_SignExecutionRequest(buffer_arg) {
  return rpc_pb.SignExecutionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_SignExecutionResponse(arg) {
  if (!(arg instanceof rpc_pb.SignExecutionResponse)) {
    throw new Error('Expected argument of type pb.SignExecutionResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_SignExecutionResponse(buffer_arg) {
  return rpc_pb.SignExecutionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_SignSettleDepositRequest(arg) {
  if (!(arg instanceof rpc_pb.SignSettleDepositRequest)) {
    throw new Error('Expected argument of type pb.SignSettleDepositRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_SignSettleDepositRequest(buffer_arg) {
  return rpc_pb.SignSettleDepositRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_SignSettleDepositResponse(arg) {
  if (!(arg instanceof rpc_pb.SignSettleDepositResponse)) {
    throw new Error('Expected argument of type pb.SignSettleDepositResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_SignSettleDepositResponse(buffer_arg) {
  return rpc_pb.SignSettleDepositResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_SignTransferRequest(arg) {
  if (!(arg instanceof rpc_pb.SignTransferRequest)) {
    throw new Error('Expected argument of type pb.SignTransferRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_SignTransferRequest(buffer_arg) {
  return rpc_pb.SignTransferRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_SignTransferResponse(arg) {
  if (!(arg instanceof rpc_pb.SignTransferResponse)) {
    throw new Error('Expected argument of type pb.SignTransferResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_SignTransferResponse(buffer_arg) {
  return rpc_pb.SignTransferResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_SignVoteRequest(arg) {
  if (!(arg instanceof rpc_pb.SignVoteRequest)) {
    throw new Error('Expected argument of type pb.SignVoteRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_SignVoteRequest(buffer_arg) {
  return rpc_pb.SignVoteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_SignVoteResponse(arg) {
  if (!(arg instanceof rpc_pb.SignVoteResponse)) {
    throw new Error('Expected argument of type pb.SignVoteResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_SignVoteResponse(buffer_arg) {
  return rpc_pb.SignVoteResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_UnlockRequest(arg) {
  if (!(arg instanceof rpc_pb.UnlockRequest)) {
    throw new Error('Expected argument of type pb.UnlockRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_UnlockRequest(buffer_arg) {
  return rpc_pb.UnlockRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_UnlockResponse(arg) {
  if (!(arg instanceof rpc_pb.UnlockResponse)) {
    throw new Error('Expected argument of type pb.UnlockResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_pb_UnlockResponse(buffer_arg) {
  return rpc_pb.UnlockResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// The wallet service definition
var walletServiceService = exports.walletServiceService = {
  newWallet: {
    path: '/pb.walletService/NewWallet',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.NewWalletRequest,
    responseType: rpc_pb.NewWalletResponse,
    requestSerialize: serialize_pb_NewWalletRequest,
    requestDeserialize: deserialize_pb_NewWalletRequest,
    responseSerialize: serialize_pb_NewWalletResponse,
    responseDeserialize: deserialize_pb_NewWalletResponse,
  },
  unlock: {
    path: '/pb.walletService/Unlock',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.UnlockRequest,
    responseType: rpc_pb.UnlockResponse,
    requestSerialize: serialize_pb_UnlockRequest,
    requestDeserialize: deserialize_pb_UnlockRequest,
    responseSerialize: serialize_pb_UnlockResponse,
    responseDeserialize: deserialize_pb_UnlockResponse,
  },
  signTransfer: {
    path: '/pb.walletService/SignTransfer',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SignTransferRequest,
    responseType: rpc_pb.SignTransferResponse,
    requestSerialize: serialize_pb_SignTransferRequest,
    requestDeserialize: deserialize_pb_SignTransferRequest,
    responseSerialize: serialize_pb_SignTransferResponse,
    responseDeserialize: deserialize_pb_SignTransferResponse,
  },
  signVote: {
    path: '/pb.walletService/SignVote',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SignVoteRequest,
    responseType: rpc_pb.SignVoteResponse,
    requestSerialize: serialize_pb_SignVoteRequest,
    requestDeserialize: deserialize_pb_SignVoteRequest,
    responseSerialize: serialize_pb_SignVoteResponse,
    responseDeserialize: deserialize_pb_SignVoteResponse,
  },
  signExecution: {
    path: '/pb.walletService/SignExecution',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SignExecutionRequest,
    responseType: rpc_pb.SignExecutionResponse,
    requestSerialize: serialize_pb_SignExecutionRequest,
    requestDeserialize: deserialize_pb_SignExecutionRequest,
    responseSerialize: serialize_pb_SignExecutionResponse,
    responseDeserialize: deserialize_pb_SignExecutionResponse,
  },
  signCreateDeposit: {
    path: '/pb.walletService/SignCreateDeposit',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SignCreateDepositRequest,
    responseType: rpc_pb.SignCreateDepositResponse,
    requestSerialize: serialize_pb_SignCreateDepositRequest,
    requestDeserialize: deserialize_pb_SignCreateDepositRequest,
    responseSerialize: serialize_pb_SignCreateDepositResponse,
    responseDeserialize: deserialize_pb_SignCreateDepositResponse,
  },
  signSettleDeposit: {
    path: '/pb.walletService/SignSettleDeposit',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.SignSettleDepositRequest,
    responseType: rpc_pb.SignSettleDepositResponse,
    requestSerialize: serialize_pb_SignSettleDepositRequest,
    requestDeserialize: deserialize_pb_SignSettleDepositRequest,
    responseSerialize: serialize_pb_SignSettleDepositResponse,
    responseDeserialize: deserialize_pb_SignSettleDepositResponse,
  },
  decodeAddress: {
    path: '/pb.walletService/DecodeAddress',
    requestStream: false,
    responseStream: false,
    requestType: rpc_pb.DecodeAddressRequest,
    responseType: rpc_pb.DecodeAddressResponse,
    requestSerialize: serialize_pb_DecodeAddressRequest,
    requestDeserialize: deserialize_pb_DecodeAddressRequest,
    responseSerialize: serialize_pb_DecodeAddressResponse,
    responseDeserialize: deserialize_pb_DecodeAddressResponse,
  },
};

exports.walletServiceClient = grpc.makeGenericClientConstructor(walletServiceService);
