import { notification, Table } from "antd";
import gql from "graphql-tag";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Query } from "react-apollo";
import { webBpApolloClient } from "../common/apollo-client";
import { SpinPreloader } from "../common/spin-preloader";

export const GET_BP_CANDIDATES = gql`
  query bpCandidates {
    bpCandidates {
      rank
      id
      logo
      name
      status
      liveVotes
      liveVotesDelta
      percent
      registeredName
      socialMedia
    }
  }
`;

export function BpTable(): JSX.Element {
  const columns = [
    {
      title: "#",
      key: "index"
    },
    {
      title: t("candidate.delegate_name"),
      dataIndex: "name",
      key: "name"
    },
    {
      title: t("candidate.status"),
      dataIndex: "status"
    },
    {
      title: t("candidate.live_votes"),
      dataIndex: "liveVotes",
      key: "liveVotes"
    },
    {
      title: t("candidate.percent"),
      dataIndex: "percent",
      key: "percent"
    },
    {
      title: "",
      key: "action",
      width: "140px"
    }
  ];

  return (
    <Query client={webBpApolloClient} query={GET_BP_CANDIDATES}>
      {({ loading, error, data }) => {
        if (!loading && error) {
          notification.error({
            message: "Error",
            description: `failed to get block producers: ${error.message}`,
            duration: 3
          });
          return null;
        }

        const bpCandidates = data && data.bpCandidates;

        return (
          <div>
            <SpinPreloader spinning={loading}>
              <Table
                pagination={{ pageSize: 50 }}
                dataSource={bpCandidates}
                columns={columns}
                rowKey={"id"}
                scroll={{ x: true }}
              />
            </SpinPreloader>
          </div>
        );
      }}
    </Query>
  );
}
