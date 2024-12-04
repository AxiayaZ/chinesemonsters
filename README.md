# Chinese Monster Encyclopedia

A comprehensive web application dedicated to exploring and documenting Chinese mythological creatures, featuring an interactive map, knowledge graph, and detailed categorization system.

## Overview

The Chinese Monster Encyclopedia is a digital platform that brings ancient Chinese mythology to life through modern web technology. It offers users an immersive experience to explore various supernatural beings from Chinese folklore through multiple interactive interfaces.

## Features

### 1. Interactive Map
- Geographical distribution of monsters across China
- Interactive markers with detailed information
- Customizable display options (100/300/500/All markers)
- Real-time location-based search

### 2. Category System
- Five main categories: 统领, 妖, 精, 鬼, 怪
- Detailed filtering and sorting capabilities
- Advanced search functionality
- Pagination for better navigation

### 3. Knowledge Graph
- Visual representation of relationships between monsters, locations, and literature
- Interactive node exploration
- Zoom and pan capabilities
- Detailed information panels
- Currently includes partial content from "山海经" (Classic of Mountains and Seas)
  - Note: Knowledge graph data is currently limited to "山海经" content, with plans for future expansion to include other classical texts

### 4. Monster Details
- Comprehensive information about each creature
- Historical references and sources
- Related monsters and connections
- High-quality imagery

## User Guide

### Navigation
1. **Home Page**: Access the main categories and featured content
2. **Monster Page**: Browse through the monster catalog
3. **Knowledge Graph**: Explore relationships and connections
4. **Map**: Discover geographical distributions

### Search Functionality
- Use the search bar in the header for quick access
- Filter by categories, abilities, or locations
- Utilize advanced search options for specific queries

### Interactive Features
- Click on map markers to view monster details
- Interact with knowledge graph nodes for relationship information
- Navigate through related monsters using pagination

## Technical Details

### Stack
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Map: AMap API
- Graph Visualization: D3.js

### Data Sources

#### Primary Reference
- Book Title: Chinese Monster Stories (中国妖怪故事)
- Author: Zhang Yun (张云)
- Publication Date: June 1, 2020
- Publisher: Beijing United Publishing Co., Ltd (北京联合出版公司)

#### Image Credits
- Monsters 01-33: Created by Sammy山米
  Source: https://m.zcool.com.cn/work/ZNTAyNDAwMjA=.html?lng=zh 
- Additional Images: AI-generated content

### Database Structure

#### JSON Data Files
The monster data is organized into multiple JSON files located in the `/data/json` directory.
Each JSON file contains detailed information about monsters including their names, types, descriptions, abilities, and geographical locations.

