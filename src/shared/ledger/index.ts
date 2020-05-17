const CLA = 0x55;
const CHUNK_SIZE = 250;

const INS = {
  GET_VERSION: 0x00,
  PUBLIC_KEY_SECP256K1: 0x01,
  SIGN_SECP256K1: 0x02,
  SHOW_ADDR_SECP256K1: 0x03,
  GET_ADDR_SECP256K1: 0x04
};

const ERROR_DESCRIPTION = {
  1: "U2F: Unknown",
  2: "U2F: Bad request",
  3: "U2F: Configuration unsupported",
  4: "U2F: Device Ineligible",
  5: "U2F: Timeout",
  14: "Timeout",
  0x9000: "No errors",
  0x9001: "Device is busy",
  0x6400: "Execution Error",
  0x6700: "Wrong Length",
  0x6982: "Empty Buffer",
  0x6983: "Output buffer too small",
  0x6984: "Data is invalid",
  0x6985: "Conditions not satisfied",
  0x6986: "Transaction rejected",
  0x6a80: "Bad key handle",
  0x6b00: "Invalid P1/P2",
  0x6d00: "Instruction not supported",
  0x6e00: "IoTeX app does not seem to be open",
  0x6f00: "Unknown error",
  0x6f01: "Sign/verify error"
};

function errorCodeToString(statusCode: number): string {
  if (statusCode in ERROR_DESCRIPTION) {
    // @ts-ignore
    return ERROR_DESCRIPTION[statusCode];
  }
  return `Unknown Status Code: ${statusCode}`;
}

// tslint:disable-next-line:no-any
function processErrorResponse(response: any): any {
  return {
    return_code: response.statusCode,
    error_message: errorCodeToString(response.statusCode)
  };
}

function serializePath(path: Array<number>): Buffer {
  if (path == null || path.length < 3) {
    throw new Error("Invalid path.");
  }
  if (path.length > 10) {
    throw new Error("Invalid path. Length should be <= 10");
  }
  const buf = Buffer.alloc(path.length * 4 + 1);
  buf.writeUInt8(path.length, 0);
  for (let i = 0; i < path.length; i += 1) {
    let v = path[i];
    if (i < 3) {
      // tslint:disable-next-line:no-bitwise
      v |= 0x80000000; // Harden
    }
    buf.writeInt32LE(v, i * 4 + 1);
  }
  return buf;
}

// tslint:disable-next-line:no-any
function signGetChunks(path: Array<number>, message: Uint8Array): Array<any> {
  const chunks = [];
  chunks.push(serializePath(path));

  const buffer = Buffer.from(message);

  for (let i = 0; i < buffer.length; i += CHUNK_SIZE) {
    let end = i + CHUNK_SIZE;
    if (i > buffer.length) {
      end = buffer.length;
    }
    chunks.push(buffer.slice(i, end));
  }

  return chunks;
}

export class IoTeXLedgerApp {
  // tslint:disable-next-line:no-any
  private readonly transport: any;

  // tslint:disable-next-line:no-any
  constructor(transport: any, scrambleKey: string = "CSM") {
    // tslint:disable-next-line:no-typeof-undefined
    if (typeof transport === "undefined") {
      throw new Error("Transport has not been defined");
    }

    this.transport = transport;
    transport.decorateAppAPIMethods(
      this,
      ["getVersion", "publicKey", "sign", "appInfo", "deviceInfo"],
      scrambleKey
    );
  }

  // tslint:disable-next-line:no-any
  public async getVersion(): Promise<any> {
    return this.transport.send(CLA, INS.GET_VERSION, 0, 0).then(
      // tslint:disable-next-line:no-any
      (response: any) => {
        const errorCodeData = response.slice(-2);
        const returnCode = errorCodeData[0] * 256 + errorCodeData[1];
        return {
          code: returnCode,
          message: errorCodeToString(returnCode),
          mode: response[0] !== 0,
          major: response[1],
          minor: response[2],
          patch: response[3],
          deviceLocked: response[4] === 1
        };
      },
      processErrorResponse
    );
  }

  // tslint:disable-next-line:no-any
  public async appInfo(): Promise<any> {
    return this.transport.send(0xb0, 0x01, 0, 0).then(
      // tslint:disable-next-line:no-any
      (response: any) => {
        const errorCodeData = response.slice(-2);
        const returnCode = errorCodeData[0] * 256 + errorCodeData[1];

        const result = {};

        let appName = "err";
        let appVersion = "err";
        let flagLen = 0;
        let flagsValue = 0;

        if (response[0] !== 1) {
          // @ts-ignore
          result.error_message = "response format ID not recognized";
          // @ts-ignore
          result.return_code = 0x9001;
        } else {
          const appNameLen = response[1];
          appName = response.slice(2, appNameLen + 2).toString("ascii");
          let idx = appNameLen + 2;
          const appVersionLen = response[idx];
          idx += 1;
          appVersion = response
            .slice(idx, idx + appVersionLen)
            .toString("ascii");
          idx += appVersionLen;
          const appFlagsLen = response[idx];
          idx += 1;
          flagLen = appFlagsLen;
          flagsValue = response[idx];
        }

        return {
          code: returnCode,
          message: errorCodeToString(returnCode),
          appName,
          appVersion,
          flagLen,
          flagsValue,
          // tslint:disable-next-line:no-bitwise
          flag_recovery: (flagsValue & 1) !== 0,
          // tslint:disable-next-line:no-bitwise
          flag_signed_mcu_code: (flagsValue & 2) !== 0,
          // tslint:disable-next-line:no-bitwise
          flag_onboarded: (flagsValue & 4) !== 0,
          // tslint:disable-next-line:no-bitwise
          flag_pin_validated: (flagsValue & 128) !== 0
        };
      },
      processErrorResponse
    );
  }

  // tslint:disable-next-line:no-any
  public async deviceInfo(): Promise<any> {
    return this.transport
      .send(0xe0, 0x01, 0, 0, Buffer.from([]), [0x9000, 0x6e00])
      .then(
        // tslint:disable-next-line:no-any
        (response: any) => {
          const errorCodeData = response.slice(-2);
          const returnCode = errorCodeData[0] * 256 + errorCodeData[1];

          if (returnCode === 0x6e00) {
            return {
              return_code: returnCode,
              error_message: "This command is only available in the Dashboard"
            };
          }

          const targetId = response.slice(0, 4).toString("hex");

          let pos = 4;
          const secureElementVersionLen = response[pos];
          pos += 1;
          const seVersion = response
            .slice(pos, pos + secureElementVersionLen)
            .toString();
          pos += secureElementVersionLen;

          const flagsLen = response[pos];
          pos += 1;
          const flag = response.slice(pos, pos + flagsLen).toString("hex");
          pos += flagsLen;

          const mcuVersionLen = response[pos];
          pos += 1;
          // Patch issue in mcu version
          let tmp = response.slice(pos, pos + mcuVersionLen);
          if (tmp[mcuVersionLen - 1] === 0) {
            tmp = response.slice(pos, pos + mcuVersionLen - 1);
          }
          const mcuVersion = tmp.toString();

          return {
            code: returnCode,
            message: errorCodeToString(returnCode),
            targetId,
            seVersion,
            flag,
            mcuVersion
          };
        },
        processErrorResponse
      );
  }

  // tslint:disable-next-line:no-any
  public async publicKey(path: Array<number>): Promise<any> {
    const serializedPath = serializePath(path);
    return this.transport
      .send(CLA, INS.PUBLIC_KEY_SECP256K1, 0, 0, serializedPath)
      .then(
        // tslint:disable-next-line:no-any
        (response: any) => {
          const errorCodeData = response.slice(-2);
          const returnCode = errorCodeData[0] * 256 + errorCodeData[1];
          const pk = Buffer.from(response.slice(0, 65));
          return {
            publicKey: pk,
            code: returnCode,
            message: errorCodeToString(returnCode)
          };
        },
        processErrorResponse
      );
  }

  public async signSendChunk(
    // tslint:disable-next-line:no-any
    chunkIdx: any,
    // tslint:disable-next-line:no-any
    chunkNum: any,
    // tslint:disable-next-line:no-any
    chunk: any
    // tslint:disable-next-line:no-any
  ): Promise<any> {
    return this.transport
      .send(CLA, INS.SIGN_SECP256K1, chunkIdx, chunkNum, chunk, [
        0x9000,
        0x6a80,
        0x6986
      ])
      .then(
        // tslint:disable-next-line:no-any
        (response: any) => {
          const errorCodeData = response.slice(-2);
          const returnCode = errorCodeData[0] * 256 + errorCodeData[1];

          let errorMessage = errorCodeToString(returnCode);

          if (returnCode === 0x6a80) {
            errorMessage = response
              .slice(0, response.length - 2)
              .toString("ascii");
          }

          let signature = null;
          if (response.length > 2) {
            signature = response.slice(0, response.length - 2);
          }

          return {
            signature,
            code: returnCode,
            message: errorMessage
          };
        },
        processErrorResponse
      );
  }

  // tslint:disable-next-line:no-any
  public async sign(path: Array<number>, message: Uint8Array): Promise<any> {
    const chunks = signGetChunks(path, message);
    return this.signSendChunk(1, chunks.length, chunks[0]).then(
      async response => {
        let result = {
          code: response.code,
          message: response.message,
          signature: null
        };

        for (let i = 1; i < chunks.length; i += 1) {
          result = await this.signSendChunk(i + 1, chunks.length, chunks[i]);
          if (result.code !== 0x9000) {
            break;
          }
        }

        return {
          code: result.code,
          message: result.message,
          signature: result.signature
        };
      },
      processErrorResponse
    );
  }
}
