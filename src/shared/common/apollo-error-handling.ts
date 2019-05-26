import notification from "antd/lib/notification";
import { onError } from "apollo-link-error";

const onErrorLink = onError(error => {
  const { graphQLErrors, networkError, operation } = error;
  if (graphQLErrors) {
    if (
      operation.variables.ignoreErrorNotification ||
      !operation.operationName
    ) {
      return;
    }
    graphQLErrors.map(graphError => {
      const { message } = graphError;
      // Disable notifying for not found error as a common case.
      // The UI should handle this kind of error (if needed) specifically for each case.
      if (`${message}`.match(/NOT_FOUND|not\s+exist\s+in\s+DB/i)) {
        return;
      }
      notification.error({
        key: operation.operationName,
        message: "Query error!",
        description: `${message}`,
        duration: 3
      });
    });
  }
  // Always notify network error.
  // It's helpful for user to check their connection conditional and retry.
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
