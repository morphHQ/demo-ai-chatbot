import { connectorIds, modelIds, morph } from "@/app/(morph)/morph";
import { tool } from "ai";
import { z } from "zod";

export const listResources = ({ ownerId }: { ownerId: string }) => {
  return tool({
    description: `List resources from external tools`,
    parameters: z.object({
      connectorId: z.enum(connectorIds),
      modelId: z.enum(modelIds),
    }),
    execute: async ({ connectorId, modelId }) => {
      const resource = morph
        .connections({ ownerId, connectorId })
        .resources(modelId);

      const { data, error } = await resource.list();

      if (error) return { error };

      return { data, connectorId };
    },
  });
};
