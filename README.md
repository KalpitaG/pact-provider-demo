# Pact Provider Demo

> Provider service for AI-powered contract testing demo

## Overview

This is a demo **provider** repository that:
- Exposes a REST API (Items, Categories, Users)
- Verifies contracts published by consumers
- Reports verification results to Pactflow

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Run contract verification
npm run verify
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /items | List all items |
| GET | /items/:id | Get item by ID |
| GET | /items/search | Search items |
| POST | /items | Create item |
| PUT | /items/:id | Replace item |
| PATCH | /items/:id | Update item |
| DELETE | /items/:id | Delete item |
| GET | /categories | List categories |
| GET | /categories/:id | Get category |
| GET | /categories/:id/items | Get items in category |
| POST | /categories | Create category |
| GET | /users/:id | Get user (public) |
| GET | /users/:id/profile | Get user profile |
| GET | /health | Health check |

## Contract Verification

### How It Works

1. Consumer publishes pact to Pactflow
2. This workflow triggers (webhook or label)
3. Start provider server
4. Fetch pacts from Pactflow
5. Replay each interaction against provider
6. Report results to Pactflow

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PACTFLOW_BASE_URL` | Pactflow instance URL |
| `PACTFLOW_TOKEN` | Pactflow API token |
| `PACT_PROVIDER` | Provider name (default: ProviderService) |
| `PORT` | Server port (default: 3001) |

## Workflow Triggers

| Trigger | Event | Use Case |
|---------|-------|----------|
| Label | Add `contract-testing` | Manual verification |
| Webhook | Consumer publishes pact | Automatic verification |
| Push | Merge to main | Deploy-time verification |
| PR | Open/update PR | Ensure changes don't break contracts |
