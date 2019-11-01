import {
  Args,
  ArgsType,
  Field,
  ObjectType,
  Query,
  Resolver
} from "type-graphql";

import fetch from "node-fetch";
// @ts-ignore
import * as solc from "solc";

@ArgsType()
class SolcRequest {
  @Field(_ => String, { nullable: false })
  public source: string;
  @Field(_ => String, { nullable: false })
  public version: string;
}

@ObjectType()
export class Contract {
  @Field(_ => String)
  public name: string;
  @Field(_ => String)
  public abi: string;
  @Field(_ => String)
  public bytecode: string;
}

@ObjectType()
export class SolcResult {
  @Field(_ => [Contract])
  public contracts: Array<Contract>;
}

@ObjectType()
export class SolcVersion {
  @Field(_ => String)
  public name: string;
  @Field(_ => String)
  public version: string;
}

// tslint:disable-next-line:no-any
const solcSnapshots: any = {};
// tslint:disable-next-line:no-any
const loadSolc = async (ver: string): Promise<any> => {
  if (solcSnapshots[ver]) {
    return solcSnapshots[ver];
  }
  return new Promise((resolve, reject) => {
    // tslint:disable-next-line:no-any
    solc.loadRemoteVersion(ver, (err: any, solcSnapshot: any) => {
      if (err) {
        reject(err);
      } else {
        solcSnapshots[ver] = solcSnapshot;
        resolve(solcSnapshot);
      }
    });
  });
};

let solcVersions: Array<{ name: string; version: string }> = [];
const solcVersionDict: { [version: string]: string } = {};
const syncSolcVersions = async () => {
  const res = await fetch("https://ethereum.github.io/solc-bin/bin/list.json");
  const { releases } = await res.json();
  solcVersions = Object.keys(releases).map(version => {
    solcVersionDict[version] = `${releases[version]}`.replace(
      /soljson-|\.js$/gi,
      ""
    );
    return {
      name: version,
      version: solcVersionDict[version]
    };
  });
  setTimeout(syncSolcVersions, 3600000);
};
syncSolcVersions();

@Resolver()
export class SolcResolver {
  @Query(_ => [SolcVersion])
  public async getSolcVersions(): Promise<Array<SolcVersion>> {
    return solcVersions;
  }

  @Query(_ => [Contract])
  public async compileSolidity(@Args()
  {
    source,
    version
  }: SolcRequest): Promise<Array<Contract>> {
    const compiler = await loadSolc(version);
    if (compiler.lowlevel && compiler.lowlevel.compileSingle) {
      const { contracts } = JSON.parse(compiler.lowlevel.compileSingle(source));
      return Object.keys(contracts).map(
        (name): Contract => {
          const contract = contracts[name];
          return {
            name: `${name}`.substr(1),
            abi: contract.interface,
            bytecode: contract.bytecode
          };
        }
      );
    }
    const input = {
      language: "Solidity",
      settings: {
        outputSelection: {
          main: {
            "*": ["evm.bytecode.object", "abi"]
          }
        }
      },
      sources: {
        main: {
          content: source
        }
      }
    };

    const {
      contracts: { main }
    } = JSON.parse(solc.compile(JSON.stringify(input)));
    return Object.keys(main).map(
      (name): Contract => {
        const contract = main[name];
        return {
          name,
          abi: JSON.stringify(contract.abi),
          bytecode: contract.evm.bytecode.object
        };
      }
    );
  }
}
