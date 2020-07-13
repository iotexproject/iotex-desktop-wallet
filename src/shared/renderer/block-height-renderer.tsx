import Col from "antd/lib/col";
import Icon from "antd/lib/icon";
import notification from "antd/lib/notification";
import Row from "antd/lib/row";
import { get } from "dottie";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { LinkButton } from "../common/buttons";
import { colors } from "../common/styles/style-color";
import { VerticalTableRender } from "../common/vertical-table";
import { GET_LATEST_HEIGHT } from "../queries";

const BlockHeightRenderer: VerticalTableRender<string> = ({ value }) => {
  const height = Number(`${value}`);
  const leftPath = height > 1 ? `/block/${height - 1}` : `/block/${height}`;
  return (
    <Row type="flex" align="middle" justify="start" gutter={10}>
      <Col>
        <LinkButton
          href={leftPath}
          disabled={!leftPath}
          style={{ paddingLeft: 0 }}
        >
          {
            <Icon
              type="caret-left"
              style={{
                color: height > 1 ? colors.primary : colors.black60
              }}
            />
          }
        </LinkButton>
      </Col>
      <Col>
        <LinkButton href={`/block/${height}`}>{height}</LinkButton>
      </Col>
      <Col>
        <Query query={GET_LATEST_HEIGHT}>
          {({
            data,
            error
          }: QueryResult<{ chainMeta: { height: number } }>) => {
            if (error) {
              notification.error({
                message: `failed to get latest height in BlockHeightRenderer: ${error}`
              });
            }
            const latestHeight = Number(
              get<string>(data || {}, "chainMeta.height")
            );
            const rightPath =
              latestHeight > height
                ? `/block/${height + 1}`
                : `/block/${height}`;
            return (
              <LinkButton href={rightPath}>
                {
                  <Icon
                    type="caret-right"
                    style={{
                      color:
                        latestHeight > height ? colors.primary : colors.black60
                    }}
                  />
                }
              </LinkButton>
            );
          }}
        </Query>
      </Col>
    </Row>
  );
};

export { BlockHeightRenderer };
