import { Select } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { useState } from "react";

// @ts-ignore
import { connect, DispatchProp } from "react-redux";
import AddCustomRpcFormModal from "./add-custom-rpc-form-modal";
import { getAntenna } from "./get-antenna";
import { addCustomRPC, setNetwork } from "./wallet-actions";
import { IRPCProvider } from "./wallet-reducer";

export interface IChainNetworkSwitchComponentProps extends DispatchProp {
  multiChain: { current: string; chains: Array<{ name: string; url: string }> };
  customRPCs: Array<IRPCProvider>;
  network: IRPCProvider;
}

const networkName = (name: string): string => {
  const locName = t(`multiChain.chains.${name}`);
  return locName === `multiChain.chains.${name}` ? name : locName;
};

export const ChainNetworkSwitchComponent = (
  props: IChainNetworkSwitchComponentProps
) => {
  const { Option } = Select;
  const { current, chains } = props.multiChain;
  const { network, customRPCs, dispatch } = props;

  const availableNetworks: { [index: string]: IRPCProvider } = {};
  const builtInNetworks = chains.map(chain => ({
    ...chain,
    url: `${chain.url}iotex-core-proxy`
  }));
  const defaultNetwork = builtInNetworks.find(chain => chain.name === current);
  const currentNetwork = network || defaultNetwork || builtInNetworks[0];

  [
    ...builtInNetworks,
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
  }
  const [isShowForm, showForm] = useState(false);
  getAntenna().iotx.setProvider(`${currentNetwork.url}`);
  return (
    <>
      <Select
        value={`${currentNetwork.name}:${currentNetwork.url}`}
        style={{ width: "100%", marginTop: 10 }}
        className="chain-network-switch"
        onSelect={async value => {
          if (value === "custom:") {
            showForm(true);
          } else {
            getAntenna().iotx.setProvider(`${availableNetworks[value].url}`);
            dispatch(setNetwork(availableNetworks[value]));
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
        onOK={(network: IRPCProvider) => {
          dispatch(addCustomRPC(network));
          dispatch(setNetwork(network));
          getAntenna().iotx.setProvider(`${network.url}`);
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
      base: { multiChain }
    } = state;
    const { customRPCs = [], network } = state.wallet;
    return {
      multiChain,
      customRPCs,
      network
    };
  }
)(ChainNetworkSwitchComponent);
