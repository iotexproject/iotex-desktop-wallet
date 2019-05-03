import notification from "antd/lib/notification";
import { onError } from "apollo-link-error";

const onErrorLink = onError(error => {
  const { graphQLErrors, networkError } = error;
  if (graphQLErrors) {
    graphQLErrors.map(graphError => {
      const { message } = graphError;

      if (message.indexOf("failed to get action") !== -1) {
        return;
      }

      notification.error({
        message: "Query error!",
        description: `${message}`,
        duration: 3
      });
    });
  }
  if (networkError) {
    notification.error({
      message: "Connection error!",
      description: `${networkError.message}`,
      duration: 3
    });
  }
});

export default onErrorLink;
