// @ts-ignore
import { MyServer } from "../server/start-server";

export function setModel(server: MyServer): void {
  server.model = server.model || {};
}
