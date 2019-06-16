import { Select } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { useState } from "react";

// @ts-ignore
import { connect, DispatchProp } from "react-redux";
import { Token } from "../../erc20/token";
import { setApolloClientEndpoint } from "../common/apollo-client";
import AddCustomRpcFormModal from "./add-custom-rpc-form-modal";
import { getAntenna } from "./get-antenna";
import { addCustomRPC, setNetwork } from "./wallet-actions";
import { IRPCProvider } from "./wallet-reducer";

export interface IChainNetworkSwitchComponentProps extends DispatchProp {
  multiChain: { current: string; chains: Array<{ name: string; url: string }> };
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
  // Check for default erc20 tokens supported.
  const supportStatus = await Promise.all(
    defaultTokens.map(token => Token.getToken(token).checkValid())
  );
  return defaultTokens.filter((_, i) => supportStatus[i]);
};

export const setProviderNetwork = (url: string) => {
  getAntenna().iotx.setProvider(`${url}iotex-core-proxy`);
  setApolloClientEndpoint(`${url}api-gateway/`);
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
      url: ""
    }
  ].forEach(chain => {
    const key = `${chain.name}:${chain.url}`;
    availableNetworks[key] = chain;
  });
  if (!network && defaultNetwork) {
    dispatch(setNetwork(defaultNetwork));
    setProviderNetwork(`${defaultNetwork.url}`);
  }
  const [isShowForm, showForm] = useState(false);
  return (
    <>
      <Select
        value={`${currentNetwork.name}:${currentNetwork.url}`}
        className="chain-network-switch"
        style={{ width: "100%" }}
        onSelect={async (value: string) => {
          if (value === "custom:") {
            showForm(true);
          } else {
            setProviderNetwork(`${availableNetworks[value].url}`);
            const supportTokens = await getDefaultNetworkTokens(
              defaultERC20Tokens
            );
            dispatch(setNetwork(availableNetworks[value], supportTokens));
          }
        }}
      >
        {Object.keys(availableNetworks).map(key => (
          <Option value={key}>
            {networkName(availableNetworks[key].name)}
          </Option>
        ))}
      </Select>
      <AddCustomRpcFormModal
        onCancel={() => showForm(false)}
        onOK={async (network: IRPCProvider) => {
          dispatch(addCustomRPC(network));
          setProviderNetwork(`${network.url}`);
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
