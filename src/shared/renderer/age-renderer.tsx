import React from "react";
import { Timestamp } from "../../api-gateway/resolvers/antenna-types";
import { translateFn } from "../common/from-now";
import { VerticalTableRender } from "../common/vertical-table";

const AgeRenderer: VerticalTableRender<Timestamp> = ({ value }) => {
  return (
    <span>
      {`${translateFn(value)} (${new Date(
        value.seconds * 1000
      ).toISOString()})`}
    </span>
  );
};

export { AgeRenderer };
