import { telemetry } from "../observability/telemetry.js";

await import("../observability/logger.js")
telemetry.start()
await import("./server.js");