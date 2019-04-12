import React from "react";

import { storiesOf } from "@storybook/react";
import { linkTo } from "@storybook/addon-links";

import { Welcome } from "@storybook/react/demo";
import { NotFound } from "../src/shared/common/not-found";
import { TestRoot } from "../src/shared/common/test-root";
import WriteContractModal from "../src/shared/wallet/write-contract-modal";
import { Deploy } from "../src/shared/wallet/contract/deploy";

storiesOf("Welcome", module)
  .add("to Storybook", () => <Welcome showApp={linkTo("Button")} />)
  .add("WriteContractModal", () => (
    <TestRoot>
      <WriteContractModal
        showModal={true}
        generateTransaction={() => undefined}
        networkAddress={"addddddreeeesss"}
        amount={"10000"}
      />
    </TestRoot>
  ));

storiesOf("Pages", module).add("NotFound", () => (
  <TestRoot>
    <NotFound />
  </TestRoot>
));

storiesOf("Smart Contract", module).add("Deploy", () => (
  <TestRoot>
    <Deploy />
  </TestRoot>
));
