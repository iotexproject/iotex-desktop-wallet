import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import Popover from "antd/lib/popover";
import Row from "antd/lib/row";
import Tooltip from "antd/lib/tooltip";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { LinkButton } from "./buttons";
import { CopyToClipboard } from "./copy-to-clipboard";

export interface IShareCallOutProps {
  link: string;
  emailBody: string;
  emailSubject: string;
  title?: string;
}
const ShareCallout: React.FC<IShareCallOutProps> = ({
  link,
  emailBody,
  emailSubject,
  title
}) => {
  const emailHref = `mailto:?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;
  return (
    <Popover
      placement="bottomRight"
      content={
        <Row>
          <h4>{title || t("action.share_this_action")}</h4>
          <Row type="flex" justify="space-between" gutter={40}>
            <Col>
              <CopyToClipboard text={link}>
                <LinkButton icon="link">{t("action.copy_link")}</LinkButton>
              </CopyToClipboard>
            </Col>
            <Col>
              <a href={emailHref} target="_blank" rel="noreferrer">
                <Tooltip placement="top" title={t("action.click_send_email")}>
                  <LinkButton icon="mail">{t("action.email")}</LinkButton>
                </Tooltip>
              </a>
            </Col>
          </Row>
        </Row>
      }
      trigger="hover"
    >
      <LinkButton>
        <Icon style={{ fontSize: "18px" }} type="share-alt" />
      </LinkButton>
    </Popover>
  );
};

export { ShareCallout };
