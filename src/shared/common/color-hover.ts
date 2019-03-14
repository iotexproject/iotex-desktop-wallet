import { shade } from "./styles/shade";

export function colorHover(color: string): object {
  return {
    color,
    ":hover": {
      color: shade(color)
    }
  };
}
