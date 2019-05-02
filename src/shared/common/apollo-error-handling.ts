import notification from "antd/lib/notification";
import { onError } from "apollo-link-error";

const onErrorLink = onError(error => {
  const { graphQLErrors, networkError, operation } = error;
  if (operation.variables.ignoreErrorNotification) {
    return;
  }
  if (graphQLErrors) {
    graphQLErrors.map(graphError => {
      const { message } = graphError;
      notification.error({
        key: operation.operationName,
        message: "Query error!",
        description: `${message}`,
        duration: 3
      });
    });
  }
  if (networkError) {
    notification.error({
      key: operation.operationName,
      message: "Connection error!",
      description: `${networkError.message}`,
      duration: 3
    });
  }
});

export default onErrorLink;
