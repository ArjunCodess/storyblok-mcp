import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";
import { CDN_BASE, MANAGEMENT_BASE, MANAGEMENT_TOKEN, PUBLIC_TOKEN, buildURL, getHeaders, toQuery } from "./utils.js";

export function storyblok(server: McpServer) {
  server.tool('ping', {}, async () => {
    try {
      await axios.get(`${CDN_BASE}/spaces/${process.env.STORYBLOK_SPACE_ID}?token=${PUBLIC_TOKEN}`);
      return { content: [{ type: 'text', text: 'Server is running and Storyblok API is reachable.' }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_stories', {
    page: z.number().optional(),
    per_page: z.number().optional(),
    starts_with: z.string().optional(),
    by_slugs: z.string().optional(),
    excluding_slugs: z.string().optional(),
    sort_by: z.string().optional(),
    search_term: z.string().optional()
  }, async (params) => {
    try {
      const q = toQuery({ ...params, token: PUBLIC_TOKEN });
      const res = await axios.get(`${CDN_BASE}/stories${q}`);
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_story', { id: z.string() }, async ({ id }) => {
    try {
      const q = toQuery({ token: PUBLIC_TOKEN });
      const res = await axios.get(`${CDN_BASE}/stories/${id}${q}`);
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_story', {
    name: z.string(),
    slug: z.string(),
    content: z.record(z.unknown()),
    parent_id: z.number().optional(),
    is_folder: z.boolean().optional(),
    is_startpage: z.boolean().optional(),
    tag_list: z.array(z.string()).optional()
  }, async (params) => {
    try {
      const res = await axios.post(buildURL(MANAGEMENT_BASE, 'stories'), { story: params }, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_story', {
    id: z.string(),
    name: z.string().optional(),
    slug: z.string().optional(),
    content: z.record(z.unknown()).optional(),
    tag_list: z.array(z.string()).optional()
  }, async ({ id, ...params }) => {
    try {
      const res = await axios.put(buildURL(MANAGEMENT_BASE, `stories/${id}`), { story: params }, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_story', { id: z.string() }, async ({ id }) => {
    try {
      await axios.delete(buildURL(MANAGEMENT_BASE, `stories/${id}`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: `Story ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('publish_story', { id: z.string() }, async ({ id }) => {
    try {
      const res = await axios.post(buildURL(MANAGEMENT_BASE, `stories/${id}/publish`), {}, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('unpublish_story', { id: z.string() }, async ({ id }) => {
    try {
      const res = await axios.post(buildURL(MANAGEMENT_BASE, `stories/${id}/unpublish`), {}, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_story_versions', { id: z.string() }, async ({ id }) => {
    try {
      const res = await axios.get(buildURL(MANAGEMENT_BASE, `stories/${id}/versions`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('restore_story', { id: z.string(), version_id: z.string() }, async ({ id, version_id }) => {
    try {
      const res = await axios.post(buildURL(MANAGEMENT_BASE, `stories/${id}/restore/${version_id}`), {}, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_tags', {}, async () => {
    try {
      const res = await axios.get(buildURL(MANAGEMENT_BASE, 'tags'), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_tag', { name: z.string() }, async ({ name }) => {
    try {
      const res = await axios.post(buildURL(MANAGEMENT_BASE, 'tags'), { name }, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_tag_and_add_to_story', { name: z.string(), story_id: z.string() }, async ({ name, story_id }) => {
    try {
      const res = await axios.post(buildURL(MANAGEMENT_BASE, 'tags'), { name, story_id }, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_tag', { id: z.string() }, async ({ id }) => {
    try {
      await axios.delete(buildURL(MANAGEMENT_BASE, `tags/${id}`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: `Tag ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_releases', {
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async ({ page = 1, per_page = 25 }) => {
    try {
      const q = toQuery({ page, per_page });
      const res = await axios.get(buildURL(MANAGEMENT_BASE, `releases${q}`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_release', { name: z.string(), publish_at: z.string().optional() }, async ({ name, publish_at }) => {
    try {
      const body: any = { name };
      if (publish_at) body.publish_at = publish_at;
      const res = await axios.post(buildURL(MANAGEMENT_BASE, 'releases'), { release: body }, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('add_story_to_release', { release_id: z.string(), story_id: z.string() }, async ({ release_id, story_id }) => {
    try {
      const res = await axios.post(buildURL(MANAGEMENT_BASE, `releases/${release_id}/stories`), { story_id }, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('publish_release', { release_id: z.string() }, async ({ release_id }) => {
    try {
      const res = await axios.post(buildURL(MANAGEMENT_BASE, `releases/${release_id}/publish`), {}, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_release', { release_id: z.string() }, async ({ release_id }) => {
    try {
      await axios.delete(buildURL(MANAGEMENT_BASE, `releases/${release_id}`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: `Release ${release_id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_assets', {
    page: z.number().optional(),
    per_page: z.number().optional(),
    search: z.string().optional(),
    folder_id: z.number().optional()
  }, async ({ page = 1, per_page = 25, search, folder_id }) => {
    try {
      const q = toQuery({ page, per_page, search, folder_id });
      const res = await axios.get(buildURL(MANAGEMENT_BASE, `assets${q}`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_asset', { id: z.string() }, async ({ id }) => {
    try {
      const res = await axios.get(buildURL(MANAGEMENT_BASE, `assets/${id}`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_asset', { id: z.string() }, async ({ id }) => {
    try {
      await axios.delete(buildURL(MANAGEMENT_BASE, `assets/${id}`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: `Asset ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('init_asset_upload', { filename: z.string(), size: z.number(), content_type: z.string() }, async ({ filename, size, content_type }) => {
    try {
      const res = await axios.post(buildURL(MANAGEMENT_BASE, 'assets'), { filename, size, content_type }, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('complete_asset_upload', { asset_id: z.string() }, async ({ asset_id }) => {
    try {
      const res = await axios.post(buildURL(MANAGEMENT_BASE, `assets/${asset_id}/finish_upload`), {}, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_asset_folders', {}, async () => {
    try {
      const res = await axios.get(buildURL(MANAGEMENT_BASE, 'asset_folders'), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_asset_folder', { name: z.string(), parent_id: z.union([z.number(), z.string()]).optional() }, async ({ name, parent_id }) => {
    try {
      const folderData: any = { name };
      if (parent_id !== undefined) folderData.parent_id = parent_id;
      const res = await axios.post(buildURL(MANAGEMENT_BASE, 'asset_folders'), { asset_folder: folderData }, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_asset_folder', { id: z.string(), name: z.string() }, async ({ id, name }) => {
    try {
      const res = await axios.put(buildURL(MANAGEMENT_BASE, `asset_folders/${id}`), { asset_folder: { name } }, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_asset_folder', { id: z.string() }, async ({ id }) => {
    try {
      await axios.delete(buildURL(MANAGEMENT_BASE, `asset_folders/${id}`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: `Asset folder ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_components', {
    component_summary: z.boolean().optional(),
    include_schema_details: z.boolean().optional(),
    filter_by_name: z.string().optional()
  }, async () => {
    try {
      const res = await axios.get(buildURL(MANAGEMENT_BASE, 'components'), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_component', { id: z.string() }, async ({ id }) => {
    try {
      const res = await axios.get(buildURL(MANAGEMENT_BASE, `components/${id}`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_component', { name: z.string(), display_name: z.string().optional(), schema: z.record(z.unknown()), is_root: z.boolean().optional(), is_nestable: z.boolean().optional() }, async ({ name, display_name, schema, is_root = false, is_nestable = true }) => {
    try {
      const componentData = { component: { name, display_name: display_name || name, schema, is_root, is_nestable } };
      const res = await axios.post(buildURL(MANAGEMENT_BASE, 'components'), componentData, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_component', { id: z.string(), name: z.string().optional(), display_name: z.string().optional(), schema: z.record(z.unknown()).optional(), is_root: z.boolean().optional(), is_nestable: z.boolean().optional() }, async ({ id, name, display_name, schema, is_root, is_nestable }) => {
    try {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (display_name !== undefined) updateData.display_name = display_name;
      if (schema !== undefined) updateData.schema = schema;
      if (is_root !== undefined) updateData.is_root = is_root;
      if (is_nestable !== undefined) updateData.is_nestable = is_nestable;
      const res = await axios.put(buildURL(MANAGEMENT_BASE, `components/${id}`), { component: updateData }, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_component', { id: z.string() }, async ({ id }) => {
    try {
      await axios.delete(buildURL(MANAGEMENT_BASE, `components/${id}`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: `Component ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('search_stories', {
    starts_with: z.string().optional(),
    by_uuids: z.string().optional(),
    by_slugs: z.string().optional(),
    excluding_slugs: z.string().optional(),
    with_tag: z.string().optional(),
    is_startpage: z.boolean().optional(),
    sort_by: z.string().optional(),
    search_term: z.string().optional(),
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async (params) => {
    try {
      const q = toQuery({ ...params, token: PUBLIC_TOKEN });
      const res = await axios.get(`${CDN_BASE}/stories${q}`);
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_story_by_slug', { slug: z.string() }, async ({ slug }) => {
    try {
      const q = toQuery({ token: PUBLIC_TOKEN });
      const res = await axios.get(`${CDN_BASE}/stories/${slug}${q}`);
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_space', {}, async () => {
    try {
      const res = await axios.get(MANAGEMENT_BASE, { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_folders', {}, async () => {
    try {
      const res = await axios.get(buildURL(MANAGEMENT_BASE, 'stories?is_folder=true'), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_datasources', {
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async ({ page = 1, per_page = 25 }) => {
    try {
      const q = toQuery({ page, per_page });
      const res = await axios.get(buildURL(MANAGEMENT_BASE, `datasources${q}`), { headers: getHeaders(MANAGEMENT_TOKEN) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });
}