import { t } from "onefx/lib/iso-i18n";
import * as React from "react";
import withBreadcrumbs, {
  BreadcrumbsRoute
} from "react-router-breadcrumbs-hoc";
import { NavLink } from "react-router-dom";

const routesConfig = [
  { path: "/action", breadcrumb: "navigation.action" },
  { path: "/address", breadcrumb: "navigation.address" },
  { path: "/action/:hash", breadcrumb: "navigation.action_detail" },
  { path: "/block", breadcrumb: "navigation.block" },
  {
    path: "/block/:hash/action",
    breadcrumb: "navigation.action"
  },
  {
    path: "/block/:blockHash/action/:actionHash",
    breadcrumb: "navigation.action_detail"
  }

  // { path: "/block/:id", breadcrumb: `Block# ` }
];

const getStyleClass = (index: number) => {
  return index === 0 ? "collectionLink" : "objectLink";
};

export const Navigation = ({
  routes
}: {
  routes?: Array<BreadcrumbsRoute>;
}) => {
  const disabledRoutes = ["/address"];
  routesConfig.forEach(a => {
    a.breadcrumb = t(a.breadcrumb);
  });
  const newRoutes = [...routesConfig, ...(routes || [])];
  const breadcrumbs = withBreadcrumbs(newRoutes, {
    excludePaths: ["/"]
  })(({ breadcrumbs }) => {
    return (
      <div style={{ padding: "20px 0", fontSize: "1em" }}>
        {breadcrumbs.map(({ match, breadcrumb }, index) => (
          <span key={match.url}>
            {disabledRoutes.indexOf(match.url) === -1 ? (
              <NavLink to={match.url} className={getStyleClass(index)}>
                {index !== 0 && ` > `} {breadcrumb}
              </NavLink>
            ) : (
              <>
                {index !== 0 && ` > `} {breadcrumb}
              </>
            )}
          </span>
        ))}
      </div>
    );
  });
  return React.createElement(breadcrumbs);
};
