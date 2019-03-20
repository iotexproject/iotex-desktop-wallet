// tslint:disable:no-any
import { Avatar, Icon, Popover } from "antd";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { cloudinaryImage } from "../common/image-utils";
import { colors } from "../common/styles/style-color";

export function renderDelegateName(text: string, record: any): JSX.Element {
  return (
    <a href={`#${record.id}`} style={{ display: "flex" }}>
      <Avatar
        shape="square"
        src={cloudinaryImage(record.logo)
          .changeWidth(32)
          .cdnUrl()}
      />
      <div
        style={{
          paddingLeft: "1em",
          color: colors.PRODUCING,
          fontWeight: "bold",
          lineHeight: 1.36
        }}
      >
        <div>{text}</div>
        <div
          style={{
            fontSize: "12px",
            color: "#999",
            fontWeight: "normal",
            paddingTop: "5px"
          }}
        >
          {record.registeredName}
        </div>
      </div>
    </a>
  );
}

// @ts-ignore
export function renderStatus(text: string, record: any): JSX.Element {
  const status: "UNQUALIFIED" | "ELECTED" | "NOT_ELECTED" = record.status
    ? record.status
    : "UNQUALIFIED";
  // tslint:disable:react-no-dangerous-html
  const content = (
    <p dangerouslySetInnerHTML={{ __html: t("candidates.election.explain") }} />
  );
  return (
    <Popover content={content} trigger="click">
      <div style={{ cursor: "pointer" }}>
        <Avatar
          shape="square"
          size={14}
          style={{ backgroundColor: colors[status] }}
        />
        <span style={{ padding: "0.5em" }}>
          {t(`candidates.election.${status}`)}
        </span>
      </div>
    </Popover>
  );
}

// @ts-ignore
export function renderLiveVotes(
  text: number,
  record: any,
  index: any
): JSX.Element {
  let iconType = "minus";
  if (record.liveVotesDelta > 0) {
    iconType = "arrow-up";
  } else if (record.liveVotesDelta < 0) {
    iconType = "arrow-down";
  }

  let color = colors.black80;
  if (record.liveVotesDelta > 0) {
    color = colors.deltaUp;
  } else if (record.liveVotesDelta < 0) {
    color = colors.error;
  }

  return (
    <div>
      {
        <span style={{ padding: "0.5em" }}>
          {Math.abs(text).toLocaleString()}
        </span>
      }
      <Icon
        type={iconType}
        style={{
          color,
          fontSize: "11px"
        }}
      />
      <span
        style={{ padding: "0.5em", fontSize: "11px", color: colors.black80 }}
      >
        {Math.abs(record.liveVotesDelta).toLocaleString()}
      </span>
    </div>
  );
}
