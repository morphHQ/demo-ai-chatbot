// [MORPH] Create Morph Instance
// Import the Morph SDK from @runmorph/cloud package
import { Morph } from "@runmorph/cloud";

// Initialize the Morph client with public and secret API keys
export const morph = Morph({
  publicKey: process.env.NEXT_PUBLIC_MORPH_PUBLIC_KEY!,
  secretKey: process.env.MORPH_SECRET_KEY!,
});

// [OPTIONAL]
// Define the list of connectors you want your AI chat to support
export const connectors = [
  {
    connectorId: "hubspot",
    name: "HubSpot",
    primaryColor: "#FF7A59",
  },
  {
    connectorId: "salesforce",
    name: "Salesforce",
    primaryColor: "#00A1E0",
  },
] as const;

// Type definition for connector IDs supported
export type ConnectorId = (typeof connectors)[number]["connectorId"];

// Array of just the connector IDs for easy access
export const connectorIds = connectors.map(
  ({ connectorId }) => connectorId
) as [ConnectorId, ...ConnectorId[]];

// Helper function to get connector name from ID
export const getConnector = (connectorId: ConnectorId) => {
  const connector = connectors.find((c) => c.connectorId === connectorId);
  return connector;
};

// Define the list of model and operations supported by the AI chat
export const modelIds = [
  "genericContact",
  "genericCompany",
  "genericUser",
  "crmOpportunity",
  "crmStage",
  "crmPipeline",
] as const;
export const operationActions = ["list", "retrieve"] as const;
// Define expandable fields for each model
export const expandableFields = [
  "stage",
  "pipeline",
  "contacts",
  "companies",
  "owner",
] as const;

// Generate operations array by combining model IDs and actions
export const operations = modelIds.flatMap((modelId) =>
  operationActions.map((action) => `${modelId}::${action}`)
) as [`${(typeof modelIds)[number]}::${(typeof operationActions)[number]}`];
