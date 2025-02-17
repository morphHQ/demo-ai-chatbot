"use client";

import { toast } from "sonner";
import { useState } from "react";
// [MORPH] [COMPONENT] Display Resource List
import { type ResourceData, ResourceCard } from "./morph-resource";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { ConnectorIcon } from "./morph-connector-icon";
import { ConnectorId, getConnector } from "@/app/(morph)/morph";

type ResourceGridProps = {
  resources: ResourceData[];
  connectorId: ConnectorId;
} & {
  error: Error;
};

export function ResourceGrid({
  resources = [],
  connectorId,
  error,
}: ResourceGridProps) {
  const [showAll, setShowAll] = useState(false);
  const itemsPerRow = 2;
  const initialRows = 2;

  if (error) return toast.error(JSON.stringify(error));
  if (!Array.isArray(resources)) return null;

  // Sort resources by number of defined fields
  const sortedResources = [...resources].sort((a, b) => {
    const aFieldCount = Object.keys(a.fields).filter(
      (key) => a.fields[key] !== undefined && a.fields[key] !== null
    ).length;
    const bFieldCount = Object.keys(b.fields).filter(
      (key) => b.fields[key] !== undefined && b.fields[key] !== null
    ).length;
    return bFieldCount - aFieldCount; // Sort in descending order
  });

  const visibleResources = showAll
    ? sortedResources
    : sortedResources.slice(0, itemsPerRow * initialRows);

  const connector = getConnector(connectorId);
  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {visibleResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
        {sortedResources.length > itemsPerRow * initialRows ? (
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showAll
                ? "Show Less"
                : `Show More (${
                    sortedResources.length - itemsPerRow * initialRows
                  })`}
            </button>
            <div className="flex items-center justify-end gap-2 my-2">
              <p className="text-muted-foreground">
                {getConnector(connectorId)?.name}
              </p>
              <ConnectorIcon connectorId={connectorId} size={12} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2 my-2">
            <p className="text-muted-foreground">
              {getConnector(connectorId)?.name}
            </p>
            <ConnectorIcon connectorId={connectorId} size={12} />
          </div>
        )}
      </div>
    </>
  );
}
