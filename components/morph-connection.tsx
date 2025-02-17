"use client";

// [MORPH] [COMPONENT] Connection Manager
import { Connect } from "@runmorph/atoms";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { type ConnectorId, getConnector } from "@/app/(morph)/morph";
import Image from "next/image";
import { ConnectorIcon } from "./morph-connector-icon";

type ConnectionProps = {
  sessionToken: string;
  connectorId: ConnectorId;
} & {
  error: Error;
};

/**
 * Connection component that handles Morph connection setup and error handling
 * @param sessionToken - Token for authenticating and managing the user connection
 * @param error - Error object if session toke not provided
 */
export function Connection({
  sessionToken,
  connectorId,
  error,
}: ConnectionProps) {
  // Display error toast if there's an error
  if (error) return toast.error(JSON.stringify(error));
  const connector = getConnector(connectorId);
  return (
    <Card>
      <CardHeader className="p-3">
        <div className="flex items-center">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg truncate flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <ConnectorIcon connectorId={connectorId} />
                {connector?.name}
              </div>
              <Connect
                sessionToken={sessionToken}
                connectionCallbacks={{
                  // Handle connection errors by displaying toast message
                  onError: async (error) => {
                    toast.error(error.message);
                  },
                }}
              />
            </CardTitle>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
