import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { storyblok } from "./storyblok.js";
const server = new McpServer({
    name: "Storyblok MCP",
    version: "1.0.0"
});
storyblok(server);
const transport = new StdioServerTransport();
await server.connect(transport);
