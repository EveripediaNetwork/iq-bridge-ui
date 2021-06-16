import { snapshotGraphqlEndpoint } from "../config";
import Snapshot from "@snapshot-labs/snapshot.js";

const client = new Snapshot.Client(snapshotGraphqlEndpoint);

export default client;
