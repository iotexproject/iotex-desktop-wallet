import * as React from "react";
import withBreadcrumbs, {
  BreadcrumbsRoute
} from "react-router-breadcrumbs-hoc";
import { NavLink } from "react-router-dom";

const routesConfig = [
  { path: "/action", breadcrumb: "Action List" },
  { path: "/action/:id", breadcrumb: "Action Detail" },
  { path: "/block", breadcrumb: "Block List" }
  // { path: "/block/:id", breadcrumb: `Block# ` }
];

export const Navigation = ({
  routes
}: {
  routes?: Array<BreadcrumbsRoute>;
}) => {
  const newRoutes = [...routesConfig, ...(routes || [])];
  const breadcrumbs = withBreadcrumbs(newRoutes, {
    excludePaths: ["/"]
  })(({ breadcrumbs }) => {
    return (
      <div style={{ padding: "20px 0", fontSize: "1em" }}>
        {breadcrumbs.map(({ match, breadcrumb }, index) => (
          <span key={match.url}>
            <NavLink to={match.url}>
              {index !== 0 && ` > `} {breadcrumb}
            </NavLink>
          </span>
        ))}
      </div>
    );
  });
  return React.createElement(breadcrumbs);
};
