import React from "react";

import { storiesOf } from "@storybook/react";
import { linkTo } from "@storybook/addon-links";

import { Welcome } from "@storybook/react/demo";
import { NotFound } from "../src/shared/common/not-found";
import { TestRoot } from "../src/shared/common/test-root";

storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("Button")} />
));

storiesOf("Pages", module).add("NotFound", () => (
  <TestRoot>
    <NotFound />
  </TestRoot>
));
