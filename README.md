# Storyblok MCP Server

A smart AI bridge between Model Context Protocol (MCP) and Storyblok - the most flexible headless CMS out there.

<!-- ---

## 🚀 Demo

[![Watch the demo](https://img.youtube.com/vi/YOUR_DEMO_VIDEO_ID_HERE/0.jpg)](https://www.youtube.com/watch?v=YOUR_DEMO_VIDEO_ID_HERE) -->

---

## 📑 Table of Contents

<!-- - [🚀 Demo](#🚀-demo) -->
- [✨ Why This Project?](#✨-why-this-project)
- [🧩 What is Storyblok?](#🧩-what-is-storyblok)
- [🤖 What's an MCP Server?](#🤖-whats-an-mcp-server)
- [🏗️ Challenges I Faced](#🏗️-challenges-i-faced)
- [🛠️ How to Set Up (For Contributors)](#🛠️-how-to-set-up-for-contributors)
- [⚡ How to Use (For Users)](#⚡-how-to-use-for-users)
- [🛠️ Tools](#🛠️-tools)
  - [1. Story Management](#1-story-management)
  - [2. Tag Management](#2-tag-management)
  - [3. Release Management](#3-release-management)
  - [4. Asset Management](#4-asset-management)
  - [5. Asset Folder Management](#5-asset-folder-management)
  - [6. Component Management](#6-component-management)
  - [7. Advanced Story Search](#7-advanced-story-search)
  - [8. Space & Folder Info](#8-space--folder-info)
  - [9. Utility](#9-utility)
- [💡 How to Contribute](#💡-how-to-contribute)
- [📚 Useful Links](#📚-useful-links)
- [🏆 Thanks](#🏆-thanks)
- [📄 License](#📄-license)

---

## ✨ Why This Project?

Built for the [Storyblok Headless CMS Challenge](https://dev.to/challenges/storyblok) on DEV.to.

The goal: push AI and Storyblok's power together, make something fresh and useful.

---

## 🧩 What is Storyblok?

Storyblok is a powerful headless CMS. API-first. Easy for devs and content creators to work together.

It's modular, super flexible, and fits with any frontend or workflow you want.

---

## 🤖 What's an MCP Server?

MCP = a protocol that connects AI, tools, and data.

The MCP server is the middleman - it shows AI what it can do and what data it has.

This lets AI clients like Cursor or Claude Desktop talk to Storyblok through natural language and manage content smoothly.

---

## 🏗️ Challenges I Faced

* **Built for myself (lol):**
  Never made or installed an MCP before. Took way longer than I thought.

* **API stress:**
  Kept checking Storyblok's API docs again and again. Scared I'd miss something.

* **AI stuff pressure:**
  Trying to get AI features right without breaking things was a headache.

* **Security:**
  Had to make sure no sensitive info leaks while exposing Storyblok management.

* **Developer experience:**
  Made the server easy to run, extend, and plug into AI tools. No shortcuts.

---

## 🛠️ How to Set Up (For Contributors)

1. Clone the repo:

   ```sh
   git clone https://github.com/ArjunCodess/storyblok-mcp.git
   cd storyblok-mcp
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Run the server:

   ```sh
   pnpm start
   ```

---

## ⚡ How to Use (For Users)

### Clone the repo:

   ```sh
   git clone https://github.com/ArjunCodess/storyblok-mcp.git
   cd storyblok-mcp
   ```

### Connect with Cursor

- Open Cursor in the same directory.
- Right click on build/index.js file and click **Copy Path**.
- Now, go to **Settings** → **MCP Tools**.
- Click on **New MCP Server**
- Inside the opened `mcp.json` file. Paste this and replace PATH_YOU_COPIED with the path copied in the second step:
  ```json
  {
    "mcpServers": {
      "storyblok": {
        "command": "node PATH_YOU_COPIED",
        "env": {
          "STORYBLOK_SPACE_ID": "your_space_id",
          "STORYBLOK_MANAGEMENT_TOKEN": "your_management_token",
          "STORYBLOK_DEFAULT_PUBLIC_TOKEN": "your_public_token"
        }
      }
    }
  }
  ```

---

## 🛠️ Tools

### 1. Story Management

- **fetch_stories**  
  Retrieve a list of stories (pages, folders, or content entries) from Storyblok. Supports filtering, pagination, and search.

- **get_story**  
  Fetch a single story by its ID.

- **create_story**  
  Create a new story (page, folder, or content entry) in Storyblok.

- **update_story**  
  Update an existing story’s content, name, slug, or tags.

- **delete_story**  
  Delete a story by its ID.

- **publish_story**  
  Publish a story, making it live.

- **unpublish_story**  
  Unpublish a story, removing it from the live site.

- **get_story_versions**  
  Retrieve all previous versions of a story for version history and rollback.

- **restore_story**  
  Restore a story to a previous version.

---

### 2. Tag Management

- **fetch_tags**  
  List all tags used in the space.

- **create_tag**  
  Create a new tag.

- **create_tag_and_add_to_story**  
  Create a tag and immediately assign it to a story.

- **delete_tag**  
  Delete a tag by its ID.

---

### 3. Release Management

- **fetch_releases**  
  List all releases (content batches for scheduled publishing).

- **create_release**  
  Create a new release.

- **add_story_to_release**  
  Add a story to a release.

- **publish_release**  
  Publish all stories in a release.

- **delete_release**  
  Delete a release.

---

### 4. Asset Management

- **fetch_assets**  
  List all assets (images, files, etc.) in the space.

- **get_asset**  
  Fetch a single asset by its ID.

- **delete_asset**  
  Delete an asset.

- **init_asset_upload**  
  Start uploading a new asset.

- **complete_asset_upload**  
  Complete the asset upload process.

---

### 5. Asset Folder Management

- **fetch_asset_folders**  
  List all asset folders.

- **create_asset_folder**  
  Create a new asset folder.

- **update_asset_folder**  
  Rename an asset folder.

- **delete_asset_folder**  
  Delete an asset folder.

---

### 6. Component Management

- **fetch_components**  
  List all components (content types) in the space.

- **get_component**  
  Fetch a single component by its ID.

- **create_component**  
  Create a new component.

- **update_component**  
  Update a component’s schema or settings.

- **delete_component**  
  Delete a component.

---

### 7. Advanced Story Search

- **search_stories**  
  Search for stories using advanced filters (by slug, tag, etc.).

- **get_story_by_slug**  
  Fetch a story by its slug.

---

### 8. Space & Folder Info

- **get_space**  
  Get information about the current Storyblok space.

- **fetch_folders**  
  List all story folders.

- **fetch_datasources**  
  List all datasources (for dynamic select fields, etc.).

---

### 9. Utility

- **ping**  
  Check if the server and Storyblok API are reachable.

---

## 💡 How to Contribute

Fork, make changes, open PRs.
Found bugs or want features? Open an issue.

---

## 📚 Useful Links

* [Storyblok Docs](https://www.storyblok.com/docs)
* [MCP Protocol](https://github.com/modelcontextprotocol)
* [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
* [DEV.to Challenge](https://dev.to/challenges/storyblok)

---

## 🏆 Thanks

Made with ❤️ for the [DEV.to Storyblok Challenge](https://dev.to/challenges/storyblok).

---

## 📄 License

MIT