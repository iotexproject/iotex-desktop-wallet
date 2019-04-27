import * as React from "react";
import withBreadcrumbs from "react-router-breadcrumbs-hoc";
import { NavLink } from "react-router-dom";

const routes = [
  { path: "/action", breadcrumb: "Action List" },
  { path: "/action/:id", breadcrumb: () => "Action Detail" },
  { path: "/block", breadcrumb: "Block List" },
  { path: "/block/:id", breadcrumb: () => "Block Detail" }
];

export const Navigation = withBreadcrumbs(routes)(({ breadcrumbs }) => {
  return (
    <div>
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
