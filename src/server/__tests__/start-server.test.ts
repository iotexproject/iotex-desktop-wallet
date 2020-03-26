import test from "ava";
import axios from "axios";
import config from "config";

import { setupTestServer } from "./setup-test-server";

const port = config.get("server.port");
setupTestServer();

test("GET /health", async t => {
  try {
    const res = await axios.get(
      `http://localhost:${port}${config.get("server.routePrefix") || ""}/health`
    );
    t.deepEqual(res.status, 200, "res.status");
    t.deepEqual(res.data, "OK", "res.data");
  } catch (err) {
    t.fail(`Failed to connect to the server: ${err}`);
  }
});

test("GET /", async t => {
  try {
    const res = await axios.get(`http://localhost:${port}/`);
    t.deepEqual(res.status, 200, "res.status");
    const html = res.data;
    t.true(html.includes("html"), "html.includes('html')");
    t.true(html.includes("head"), "html.includes('head')");
    t.true(html.includes("body"), "html.includes('body')");
    t.true(
      html.includes("<div id='root'>"),
      "html.includes('<div id='root'>')"
    );
  } catch (err) {
    t.fail(`Failed to connect to the server: ${err}`);
  }
});
