// [MORPH] [TOOL] Create Connection
// Import required dependencies
import { connectorIds, morph, operations } from "@/app/(morph)/morph";
import { tool } from "ai";
import { z } from "zod";

/**
 * Connection creation tool scoped to a specific user.
 * This tool allows creating authenticated connections to external services
 * with proper access scoping and permissions.
 *
 * @param ownerId - The ID of the owner to scope the connection to
 * @returns A configured tool instance for creating morph connections
 */
export const createConnection = ({ ownerId }: { ownerId: string }) => {
  return tool({
    description: `Create a connection with relevant scope to a new external tool`,
    parameters: z.object({
      connectorId: z.enum(connectorIds),
      operations: z.array(z.enum(operations)).min(1),
    }),

    execute: async ({ connectorId, operations }) => {
      // Create a new session using Morph instance
      const { data, error } = await morph.sessions().create({
        connection: {
          ownerId,
          connectorId,
          operations,
        },
        // Session expires in 10 minutes (in seconds)
        expiresIn: 10 * 60,
      });

      if (error) return { error };

      // Extract and return the session token on success for @runmorph/atoms client components
      const { sessionToken } = data;
      return { sessionToken, connectorId, status: "awaitingAuthorization" };
    },
  });
};
