import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { VerticalTableRender } from "../common/vertical-table";

interface ITextAreaRender {
  contractAddress: string
  blkHeight: number
  topics: any[]
  data: string
  index: number
  __typename: string
}

const TextAreaRenderer: VerticalTableRender<{}> = ({ value }) => {
  if (Array.isArray(value)) {
    value.map((item: ITextAreaRender) => {
      delete item.__typename
    })
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
