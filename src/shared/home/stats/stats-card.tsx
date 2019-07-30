import { Card, Icon, Spin, Statistic } from "antd";
import React, { CSSProperties } from "react";
import { assetURL } from "../../common/asset-url";
import { colors } from "../../common/styles/style-color";

export interface IStatsCardProps {
  titleStyle: CSSProperties;
  title: string;
  value: number | string;
  prefix: JSX.Element | null;
  suffix: JSX.Element | string | null;
  style?: CSSProperties;
  valueStyle?: CSSProperties;
  loading?: boolean;
}

type State = {
  cardValue: string | number;
};

class StatsCard extends React.Component<IStatsCardProps, State> {
  constructor(props: IStatsCardProps) {
    super(props);

    this.state = {
      cardValue: ""
    };
  }

  public componentDidMount(): void {
    if (this.props.value) {
      this.animateNumber(this.props.value);
    }
  }

  public componentDidUpdate(prevProps: IStatsCardProps): void {
    if (prevProps.value !== this.props.value && this.props.value) {
      this.animateNumber(this.props.value);
    }
  }

  public getNumber = (value: string) => {
    const convertedNumber = value.replace(/,/g, "");
    return parseInt(convertedNumber, 10);
  };

  public animateNumber = (value: string | number) => {
    let cardValue = 0;
    let maxValue = 0;
    let splittedVal: Array<string> = [];
    if (typeof value === "string") {
      splittedVal = value.split("%");
      maxValue = this.getNumber(splittedVal[0]);
    } else {
      maxValue = value;
    }

    const coef = maxValue / 100;

    setInterval(() => {
      cardValue += coef;
      if (cardValue < maxValue) {
        const newCardValue = Math.round(cardValue).toLocaleString();
        this.setState({
          cardValue:
            splittedVal.length > 1 ? newCardValue.concat("%") : newCardValue
        });
      }
    }, 1);
  };

  public render(): JSX.Element {
    const { loading = false } = this.props;
    return (
      <Spin spinning={loading} indicator={<Icon type="loading" spin />}>
        <Card
          style={{
            height: 190,
            backgroundImage: `url(${assetURL("/stat_box_bg.png")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 6,
            marginTop: 10,
            ...this.props.style
          }}
          bodyStyle={{ padding: 10 }}
        >
          <Statistic
            title={
              <span
                style={{
                  padding: "5px 5px 5px 30px",
                  color: colors.black60,
                  backgroundSize: 20,
                  backgroundPosition: "left",
                  backgroundRepeat: "no-repeat",
                  ...this.props.titleStyle
                }}
              >
                {this.props.title}
              </span>
            }
            valueStyle={{
              color: colors.black60,
              minHeight: 120,
              display: "flex",
              flexFlow: "wrap",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: 10,
              fontSize: "5vmin",
              ...this.props.valueStyle
            }}
            prefix={<div style={{ marginRight: 20 }}>{this.props.prefix}</div>}
            style={{
              color: colors.white
            }}
            valueRender={() => {
              return (
                <span>
                  {this.state.cardValue} {this.props.suffix ? " / " : ""}{" "}
                  <small>{this.props.suffix}</small>
                </span>
              );
            }}
          />
        </Card>
      </Spin>
    );
  }
}

export default StatsCard;
