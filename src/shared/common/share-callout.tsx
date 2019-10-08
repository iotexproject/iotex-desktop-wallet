import { Col, Popover, Row, Tooltip } from "antd";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { LinkButton } from "./buttons";
import { CopyToClipboard } from "./copy-to-clipboard";
import { ShareIcon } from "./icons/share_icon.svg";

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
        <ShareIcon />
      </LinkButton>
    </Popover>
  );
};

export { ShareCallout };
