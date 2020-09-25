import Select from "antd/lib/select";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { useState } from "react";

// @ts-ignore
import isBrowser from "is-browser";
import { connect, DispatchProp } from "react-redux";
//@ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { Token } from "../../erc20/token";
import { setApolloClientEndpoint } from "../common/apollo-client";
import AddCustomRpcFormModal from "./add-custom-rpc-form-modal";
import { getAntenna } from "./get-antenna";
import { addCustomRPC, setNetwork } from "./wallet-actions";
import { IRPCProvider } from "./wallet-reducer";

const state = isBrowser && JsonGlobal("state");
export interface IChainNetworkSwitchComponentProps extends DispatchProp {
  multiChain: {
    current: string;
    chains: Array<IRPCProvider>;
  };
  customRPCs: Array<IRPCProvider>;
  network: IRPCProvider;
  defaultERC20Tokens: Array<string>;
}

const networkName = (name: string): string => {
  const locName = t(`multiChain.chains.${name}`);
  return locName === `multiChain.chains.${name}` ? name : locName;
};

const getDefaultNetworkTokens = async (
  defaultTokens: Array<string>
): Promise<Array<string>> => {
  // Check for default tokens supported.
  const supportStatus = await Promise.all(
    defaultTokens.map(token => Token.getToken(token).checkValid())
  );
  return defaultTokens.filter((_, i) => supportStatus[i]);
};

export const setCurrentProviderNetwork = () => {
  const multiChain = isBrowser && state.base.multiChain;
  const { current, chains } = multiChain;
  //@ts-ignore
  const network = chains.find(chain => chain.name === current);
  window.console.log(network);
  getAntenna().iotx.setProvider(network.coreUrl);
};

export const setProviderNetwork = (network: IRPCProvider) => {
  if (isBrowser) {
    getAntenna().iotx.setProvider(network.coreUrl);
    setApolloClientEndpoint(`${network.url}api-gateway/`);
  }
};

export const ChainNetworkSwitchComponent = (
  props: IChainNetworkSwitchComponentProps
) => {
  const { Option } = Select;
  const { current, chains } = props.multiChain;
  const { network, customRPCs, dispatch, defaultERC20Tokens } = props;

  const availableNetworks: { [index: string]: IRPCProvider } = {};
  const defaultNetwork = chains.find(chain => chain.name === current);
  const currentNetwork = network || defaultNetwork || chains[0];

  [
    ...chains,
    ...customRPCs,
    {
      name: "custom",
      url: "",
      coreUrl: ""
    }
  ].forEach(chain => {
    const key = `${chain.name}:${chain.coreUrl}`;
    availableNetworks[key] = chain;
  });
  if (isBrowser && !network && defaultNetwork) {
    setProviderNetwork(defaultNetwork);
    getDefaultNetworkTokens(defaultERC20Tokens).then(supportTokens => {
      dispatch(setNetwork(defaultNetwork, supportTokens));
    });
  }

  const [isShowForm, showForm] = useState(false);
  return (
    <>
      <Select
        value={`${currentNetwork.name}`}
        className="chain-network-switch"
        style={{ width: "100%" }}
        onSelect={async (value: string) => {
          if (value === "custom:") {
            showForm(true);
          } else {
            setProviderNetwork(availableNetworks[value]);
            const supportTokens = await getDefaultNetworkTokens(
              defaultERC20Tokens
            );
            dispatch(setNetwork(availableNetworks[value], supportTokens));
          }
        }}
      >
        {Object.keys(availableNetworks).map(key => (
          <Option value={key} key={key}>
            {networkName(availableNetworks[key].name)}
          </Option>
        ))}
      </Select>
      <AddCustomRpcFormModal
        onCancel={() => showForm(false)}
        onOK={async (network: IRPCProvider) => {
          dispatch(addCustomRPC(network));
          setProviderNetwork(network);
          const supportTokens = await getDefaultNetworkTokens(
            defaultERC20Tokens
          );
          dispatch(setNetwork(network, supportTokens));
          showForm(false);
        }}
        visible={isShowForm}
      />
    </>
  );
};

export const ChainNetworkSwitch = connect<IChainNetworkSwitchComponentProps>(
  // @ts-ignore
  // tslint:disable-next-line:no-any
  (state: any) => {
    const {
      base: { multiChain = {}, defaultERC20Tokens = [] }
    } = state;
    const { customRPCs = [], network } = state.wallet;
    return {
      multiChain,
      customRPCs,
      network,
      defaultERC20Tokens
    };
  }
)(ChainNetworkSwitchComponent);
