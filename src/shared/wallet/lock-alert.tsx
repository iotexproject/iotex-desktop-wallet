import Modal from "antd/lib/modal";
import throttle from "lodash.throttle";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { connect, DispatchProp } from "react-redux";

import { Account } from "iotex-antenna/lib/account/account";
import { countdownToLockInMS, delayLock } from "./wallet-actions";
import { IWalletState } from "./wallet-reducer";

interface LockWalletProps extends DispatchProp {
  lockAt: number | undefined;
  isLockDelayed: boolean | undefined;
  children?: React.ReactNode;
  account?: Account;
}

interface State {
  showModal: boolean;
}

class LockWalletComponent extends React.Component<LockWalletProps, State> {
  public state: State = {
    showModal: false
  };

  public timer: NodeJS.Timeout;
  public timer10: NodeJS.Timeout;

  private readonly setTimers = () => {
    if (typeof this.props.lockAt !== "number") {
      return;
    }

    if (this.props.lockAt === 0) {
      this.clearTimers();
      return;
    }

    const { lockAt } = this.props;
    const now = Date.now();
    const remain = lockAt - now;
    const remain10 = lockAt - now - 10 * 60 * 1000;

    // May be timed out if jump back from another page.
    if ([remain, remain10].some(num => num < 0)) {
      this.lock();
      return;
    }

    this.clearTimers();

    this.timer10 = setTimeout(() => {
      this.setState({
        showModal: true
      });

      // forbid refresh timer by mouse or keyboard events;
      this.props.dispatch(delayLock(true));
    }, remain10);

    this.timer = setTimeout(this.lock, remain);
  };

  private readonly lock = () => {
    this.clearTimers();
    window.location.href = `${window.location.origin}/wallet`;
  };

  public componentDidMount = () => {
    this.setTimers();
  };

  public componentDidUpdate = (preProps: LockWalletProps, _: State) => {
    if (this.props.lockAt !== preProps.lockAt) {
      this.setTimers();
    }
  };

  public componentWillUnmount = () => {
    this.clearTimers();
  };

  private readonly clearTimers = () => {
    clearTimeout(this.timer);
    clearTimeout(this.timer10);
  };

  /**
   * Limit the frequency of update timers;
   */
  private readonly keepActive: () => void = throttle(() => {
    // before wallet unlocked. Router path is: /wallet
    if (!this.props.account) {
      return;
    }

    if (!this.props.isLockDelayed) {
      this.props.dispatch(countdownToLockInMS());
    }
  }, 60 * 1000);

  public render(): JSX.Element {
    return (
      <div
        onClick={() => this.keepActive()}
        onKeyUp={() => this.keepActive()}
        onKeyDown={() => this.keepActive()}
        role="main"
        style={{ cursor: "pointer" }}
      >
        {this.props.children}
        <Modal
          title={t("wallet.lock.title")}
          visible={this.state.showModal}
          onOk={() => {
            this.setState({
              showModal: false
            });

            this.props.dispatch(countdownToLockInMS());
            this.props.dispatch(delayLock(false));
          }}
          onCancel={() => {
            this.setState({
              showModal: false
            });
          }}
          cancelText={t("wallet.lock.btn.no")}
          okText={t("wallet.lock.btn.yes")}
        >
          <p>{t("wallet.lock.cutdown")}</p>
        </Modal>
      </div>
    );
  }
}

export const LockWalletAlert = connect((state: { wallet: IWalletState }) => ({
  lockAt: state.wallet.lockAt,
  isLockDelayed: state.wallet.isLockDelayed,
  account: (state.wallet || {}).account
}))(LockWalletComponent);
