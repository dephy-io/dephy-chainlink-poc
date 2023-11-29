import bunyan from "bunyan";
import { LOGGER_LEVEL } from "./constants";

export const logger = bunyan.createLogger({
  name: "indexer",
  level: LOGGER_LEVEL as never,
});
