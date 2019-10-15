import { Breadcrumb, Col, Icon, Row } from "antd";
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Link } from "react-router-dom";
import { SearchBox } from "../home/search-box";
import { ContentPadding } from "./styles/style-padding";

const PageNav: React.FC<{ items: Array<JSX.Element | string> }> = ({
  items
}) => {
  return (
    <ContentPadding style={{ margin: "40px 0", fontSize: 16 }}>
      <Row type="flex" justify="space-between" align="top" gutter={20}>
        <Col xs={24} sm={24} md={16} style={{ marginBottom: 10 }}>
          <Breadcrumb
            style={{ fontSize: 16 }}
            separator=">"
            className="wordwrap"
          >
            <Breadcrumb.Item>
              <Link to="/" style={{ whiteSpace: "nowrap" }}>
                <Icon type="home" /> {t("topbar.home")}
              </Link>
            </Breadcrumb.Item>
            {items.map((item, index) => {
              return (
                <Breadcrumb.Item key={`pagenav-${index}`}>
                  {item}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <SearchBox
            enterButton={true}
            size="large"
            placeholder={t("topbar.search")}
            autoFocus={false}
          />
        </Col>
      </Row>
    </ContentPadding>
  );
};

export { PageNav };
