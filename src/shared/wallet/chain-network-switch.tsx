import { Select } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";

// @ts-ignore
import { connect } from "react-redux";

export interface IChainNetworkSwitchComponentProps {
  multiChain: { current: string; chains: Array<{ name: string; url: string }> };
}
export const ChainNetworkSwitchComponent = (
  props: IChainNetworkSwitchComponentProps
) => {
  const { Option } = Select;
  const { current, chains } = props.multiChain;
  return (
    <Select
      value={current}
      style={{ width: "100%", marginTop: 10 }}
      className="chain-network-switch"
    >
      {chains.map(chain => (
        <Option value={chain.name}>
          {t(`multiChain.chains.${chain.name}`)}
        </Option>
      ))}
    </Select>
  );
};

export const ChainNetworkSwitch = connect<IChainNetworkSwitchComponentProps>(
  state => {
    // @ts-ignore
    return { multiChain: state.base.multiChain };
  }
)(ChainNetworkSwitchComponent);
