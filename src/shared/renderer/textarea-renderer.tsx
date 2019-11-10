import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { VerticalTableRender } from "../common/vertical-table";

const TextAreaRenderer: VerticalTableRender<{}> = ({ value }) => {
  if (Array.isArray(value) && value.length > 0) {
    value.map(item => {
      delete item.__typename;
    });
  }
  const text =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return (
    <TextArea
      autosize={{ maxRows: 10 }}
      value={text}
      readOnly={true}
      className="monospace-code bg-light"
    />
  );
};

export { TextAreaRenderer };
