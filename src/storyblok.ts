import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import axios from "axios";
import { z } from "zod";

const storyblokApi = axios.create({
  baseURL: "https://api.storyblok.com/v2",
  headers: {
    "Content-Type": "application/json",
    "Authorization": process.env.STORYBLOK_MANAGEMENT_TOKEN
  }
});

export function storyblok(server: McpServer) {
  // Content Management
  server.tool("fetch_stories",
    {
      per_page: z.number().optional(),
      page: z.number().optional(),
      starts_with: z.string().optional(),
      is_startpage: z.boolean().optional(),
      sort_by: z.string().optional(),
      search_term: z.string().optional()
    },
    async (params) => {
      try {
        const response = await storyblokApi.get("/cdn/stories", {
          params: {
            token: process.env.STORYBLOK_DEFAULT_PUBLIC_TOKEN,
            ...params
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch stories: ${error.message}`);
      }
    }
  );

  server.tool("get_story",
    {
      slug: z.string()
    },
    async ({ slug }) => {
      try {
        const response = await storyblokApi.get(`/cdn/stories/${slug}`, {
          params: {
            token: process.env.STORYBLOK_DEFAULT_PUBLIC_TOKEN
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch story: ${error.message}`);
      }
    }
  );

  server.tool("create_story",
    {
      name: z.string(),
      slug: z.string(),
      content: z.record(z.any())
    },
    async ({ name, slug, content }) => {
      try {
        const response = await storyblokApi.post("/spaces/me/stories", {
          story: {
            name,
            slug,
            content
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to create story: ${error.message}`);
      }
    }
  );

  server.tool("update_story",
    {
      id: z.number(),
      content: z.record(z.any())
    },
    async ({ id, content }) => {
      try {
        const response = await storyblokApi.put(`/spaces/me/stories/${id}`, {
          story: { content }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to update story: ${error.message}`);
      }
    }
  );

  server.tool("delete_story",
    {
      id: z.number()
    },
    async ({ id }) => {
      try {
        await storyblokApi.delete(`/spaces/me/stories/${id}`);
        return {
          content: [{ type: "text", text: "Story deleted successfully" }]
        };
      } catch (error: any) {
        throw new Error(`Failed to delete story: ${error.message}`);
      }
    }
  );

  server.tool("publish_story",
    {
      id: z.number()
    },
    async ({ id }) => {
      try {
        const response = await storyblokApi.put(`/spaces/me/stories/${id}/publish`);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to publish story: ${error.message}`);
      }
    }
  );

  server.tool("unpublish_story",
    {
      id: z.number()
    },
    async ({ id }) => {
      try {
        const response = await storyblokApi.put(`/spaces/me/stories/${id}/unpublish`);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to unpublish story: ${error.message}`);
      }
    }
  );

  // Tag Management
  server.tool("fetch_tags",
    {},
    async () => {
      try {
        const response = await storyblokApi.get("/cdn/tags", {
          params: {
            token: process.env.STORYBLOK_DEFAULT_PUBLIC_TOKEN
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch tags: ${error.message}`);
      }
    }
  );

  server.tool("create_tag",
    {
      name: z.string()
    },
    async ({ name }) => {
      try {
        const response = await storyblokApi.post("/spaces/me/tags", {
          tag: { name }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to create tag: ${error.message}`);
      }
    }
  );

  server.tool("create_tag_and_add_to_story",
    {
      tag_name: z.string(),
      story_id: z.number()
    },
    async ({ tag_name, story_id }) => {
      try {
        const tagResponse = await storyblokApi.post("/spaces/me/tags", {
          tag: { name: tag_name }
        });
        const tagId = tagResponse.data.tag.id;
        
        const storyResponse = await storyblokApi.get(`/spaces/me/stories/${story_id}`);
        const story = storyResponse.data.story;
        story.tag_list = [...(story.tag_list || []), tagId];
        
        await storyblokApi.put(`/spaces/me/stories/${story_id}`, {
          story
        });
        
        return {
          content: [{ type: "text", text: JSON.stringify(tagResponse.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to create and add tag: ${error.message}`);
      }
    }
  );

  server.tool("delete_tag",
    {
      id: z.number()
    },
    async ({ id }) => {
      try {
        await storyblokApi.delete(`/spaces/me/tags/${id}`);
        return {
          content: [{ type: "text", text: "Tag deleted successfully" }]
        };
      } catch (error: any) {
        throw new Error(`Failed to delete tag: ${error.message}`);
      }
    }
  );

  // Release Management
  server.tool("fetch_releases",
    {},
    async () => {
      try {
        const response = await storyblokApi.get("/spaces/me/releases");
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch releases: ${error.message}`);
      }
    }
  );

  server.tool("create_release",
    {
      name: z.string(),
      release_date: z.string()
    },
    async ({ name, release_date }) => {
      try {
        const response = await storyblokApi.post("/spaces/me/releases", {
          release: {
            name,
            release_date
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to create release: ${error.message}`);
      }
    }
  );

  server.tool("add_story_to_release",
    {
      release_id: z.number(),
      story_id: z.number()
    },
    async ({ release_id, story_id }) => {
      try {
        const response = await storyblokApi.post(`/spaces/me/releases/${release_id}/stories`, {
          story_id
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to add story to release: ${error.message}`);
      }
    }
  );

  server.tool("publish_release",
    {
      id: z.number()
    },
    async ({ id }) => {
      try {
        const response = await storyblokApi.put(`/spaces/me/releases/${id}/publish`);
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to publish release: ${error.message}`);
      }
    }
  );

  server.tool("delete_release",
    {
      id: z.number()
    },
    async ({ id }) => {
      try {
        await storyblokApi.delete(`/spaces/me/releases/${id}`);
        return {
          content: [{ type: "text", text: "Release deleted successfully" }]
        };
      } catch (error: any) {
        throw new Error(`Failed to delete release: ${error.message}`);
      }
    }
  );

  // Asset Management
  server.tool("fetch_assets",
    {
      per_page: z.number().optional(),
      page: z.number().optional(),
      search_term: z.string().optional()
    },
    async (params) => {
      try {
        const response = await storyblokApi.get("/cdn/assets", {
          params: {
            token: process.env.STORYBLOK_DEFAULT_PUBLIC_TOKEN,
            ...params
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch assets: ${error.message}`);
      }
    }
  );

  server.tool("get_asset",
    {
      id: z.number()
    },
    async ({ id }) => {
      try {
        const response = await storyblokApi.get(`/cdn/assets/${id}`, {
          params: {
            token: process.env.STORYBLOK_DEFAULT_PUBLIC_TOKEN
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch asset: ${error.message}`);
      }
    }
  );

  server.tool("delete_asset",
    {
      id: z.number()
    },
    async ({ id }) => {
      try {
        await storyblokApi.delete(`/spaces/me/assets/${id}`);
        return {
          content: [{ type: "text", text: "Asset deleted successfully" }]
        };
      } catch (error: any) {
        throw new Error(`Failed to delete asset: ${error.message}`);
      }
    }
  );

  // Component Management
  server.tool("fetch_components",
    {},
    async () => {
      try {
        const response = await storyblokApi.get("/cdn/components", {
          params: {
            token: process.env.STORYBLOK_DEFAULT_PUBLIC_TOKEN
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch components: ${error.message}`);
      }
    }
  );

  server.tool("get_component",
    {
      name: z.string()
    },
    async ({ name }) => {
      try {
        const response = await storyblokApi.get(`/cdn/components/${name}`, {
          params: {
            token: process.env.STORYBLOK_DEFAULT_PUBLIC_TOKEN
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch component: ${error.message}`);
      }
    }
  );

  // Space Management
  server.tool("get_space",
    {},
    async () => {
      try {
        const response = await storyblokApi.get("/cdn/spaces/me", {
          params: {
            token: process.env.STORYBLOK_DEFAULT_PUBLIC_TOKEN
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch space: ${error.message}`);
      }
    }
  );

  server.tool("fetch_folders",
    {},
    async () => {
      try {
        const response = await storyblokApi.get("/cdn/folders", {
          params: {
            token: process.env.STORYBLOK_DEFAULT_PUBLIC_TOKEN
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch folders: ${error.message}`);
      }
    }
  );

  server.tool("fetch_datasources",
    {},
    async () => {
      try {
        const response = await storyblokApi.get("/cdn/datasources", {
          params: {
            token: process.env.STORYBLOK_DEFAULT_PUBLIC_TOKEN
          }
        });
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch datasources: ${error.message}`);
      }
    }
  );
} 