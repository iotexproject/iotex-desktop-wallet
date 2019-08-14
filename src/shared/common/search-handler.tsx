import { get } from "dottie";
import { History } from "history";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
import { WithApolloClient } from "react-apollo";
import { GetBlockMetasRequest } from "../../api-gateway/resolvers/antenna-types";
import { GET_BLOCK_METAS } from "../queries";

type Props = {
  history: History;
  client: WithApolloClient<{}>["client"];
};

export const handleSearch = async (
  props: Props,
  query: string
): Promise<void> => {
  const { history, client } = props;
  const value = query.trim();

  if (value.match(/^io[a-z0-9]{39}$/)) {
    return history.push(`/address/${value}`);
  }

  if (value.match(/^[a-z0-9]{130}$/)) {
    return history.push(`/address/${publicKeyToAddress(value)}`);
  }

  if (`${parseInt(value, 10)}` === `${value}`) {
    try {
      const { data } = await client.query({
        query: GET_BLOCK_METAS,
        variables: {
          byIndex: {
            start: parseInt(value, 10) || 0,
            count: 1
          },
          ignoreErrorNotification: true
        } as GetBlockMetasRequest
      });
      if (data) {
        const hash = get<string>(data, "getBlockMetas.blkMetas.0.hash");
        if (hash) {
          return history.push(`/block/${hash}`);
        }
      }
    } catch (e) {
      return history.push("/notfound");
    }
  }
  try {
    const validBlock = await client.query({
      query: GET_BLOCK_METAS,
      variables: {
        byHash: {
          blkHash: value
        },
        ignoreErrorNotification: true
      } as GetBlockMetasRequest
    });
    if (validBlock) {
      return history.push(`/block/${value}`);
    }
  } catch (error) {
    // Block not found
  }
  // Default route to action page (Ref. #497)
  return history.push(`/action/${value}`);
};
