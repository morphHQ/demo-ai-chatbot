// [MORPH] [TOOL] Update Connection
// Import required dependencies
import { connectorIds, morph, operations } from "@/app/(morph)/morph";
import { tool } from "ai";
import { z } from "zod";

/**
 * Connection update tool scoped to a specific user.
 * This tool allows updating existing authenticated connections to external services
 * with modified access scoping and permissions.
 *
 * @param ownerId - The ID of the owner whose connection to update
 * @returns A configured tool instance for updating morph connections
 */
export const updateConnection = ({ ownerId }: { ownerId: string }) => {
  return tool({
    description: `Update an existing connection's permissions and scope for an external tool`,
    parameters: z.object({
      connectorId: z.enum(connectorIds),
      operations: z.array(z.enum(operations)).min(1),
    }),

    execute: async ({ connectorId, operations }) => {
      // Update the connection's operations
      await morph.connections({ ownerId, connectorId }).update({
        // @ts-expect-error -- export type Operation<ModelId>
        operations,
      });

      // Create a new session with updated permissions
      const { data, error } = await morph.sessions().create({
        connection: {
          ownerId,
          connectorId,
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
