import {
  connectorIds,
  expandableFields,
  modelIds,
  morph,
} from "@/app/(morph)/morph";
import { tool } from "ai";
import { z } from "zod";

export const retrieveResource = ({ ownerId }: { ownerId: string }) => {
  return tool({
    description: `Retrieve a resource from external tools`,
    parameters: z.object({
      connectorId: z.enum(connectorIds),
      modelId: z.enum(modelIds),
      resourceId: z.string(),
    }),
    execute: async ({ connectorId, modelId, resourceId }) => {
      const resource = morph
        .connections({ ownerId, connectorId })
        .resources(modelId);

      const { data, error } = await resource.retrieve(resourceId);

      if (error) return { error };

      return { data, connectorId };
    },
  });
};
