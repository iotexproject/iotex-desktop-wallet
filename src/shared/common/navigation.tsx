import * as React from "react";
import withBreadcrumbs, {
  BreadcrumbsRoute
} from "react-router-breadcrumbs-hoc";
import { NavLink } from "react-router-dom";
import { t } from "onefx/lib/iso-i18n";

const routesConfig = [
  { path: "/action", breadcrumb: t("navigation.action") },
  { path: "/address", breadcrumb: t("navigation.address") },
  { path: "/action/:hash", breadcrumb: t("navigation.action_detail") },
  { path: "/block", breadcrumb: t("navigation.block") },
  {
    path: "/block/:hash/action",
    breadcrumb: t("navigation.action")
  },
  {
    path: "/block/:blockHash/action/:actionHash",
    breadcrumb: t("navigation.action_detail")
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
