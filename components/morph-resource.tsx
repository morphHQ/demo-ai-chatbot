"use client";

// [MORPH] [COMPONENT] Display Resource Card
import { ConnectorId, getConnector, modelIds } from "@/app/(morph)/morph";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  SquareUser,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  DollarSign,
  Flag,
  Building2,
  GitBranch,
  CheckCircle2,
  XCircle,
  CircleDot,
  SquareKanban,
  Building,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConnectorIcon } from "./morph-connector-icon";

export type ResourceData = {
  object: "resource";
  model: (typeof modelIds)[number];
  id: string;
  fields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

type ResourceCardPorps = {
  connectorId?: ConnectorId;
  resource: ResourceData;
  error?: Error;
};

type ModelTemplate = {
  getTitle: (fields: Record<string, any>) => string;
  icon: React.ReactNode | ((fields: Record<string, any>) => React.ReactNode);
  fieldIcons: Record<string, React.ReactNode>;
  formatValue?: Record<string, (value: any) => string>;
};

const modelTemplates: Record<string, ModelTemplate> = {
  genericContact: {
    getTitle: (fields) =>
      `${fields.firstName || ""} ${fields.lastName || ""}`.trim(),
    icon: <SquareUser className="size-5" />,
    fieldIcons: {
      email: <Mail className="size-4" />,
      phone: <Phone className="size-4" />,
    },
  },
  genericCompany: {
    getTitle: (fields) => fields.name || "Unnamed Company",
    icon: <Building className="size-5" />,
    fieldIcons: {},
    formatValue: {},
  },
  crmPipeline: {
    getTitle: (fields) => fields.name || "Unnamed Pipeline",
    icon: <SquareKanban className="size-5" />,
    fieldIcons: {
      stages: <Flag className="size-4" />,
    },
    formatValue: {
      stages: (value) => `${(value || []).length} stages`,
    },
  },
  crmStage: {
    getTitle: (fields) => fields.name || "Unnamed Stage",
    icon: (fields) => {
      switch (fields?.type?.toLowerCase()) {
        case "won":
          return <CheckCircle2 className="size-5 text-green-500" />;
        case "lost":
          return <XCircle className="size-5 text-red-500" />;
        case "open":
        default:
          return <CircleDot className="size-5 text-blue-500" />;
      }
    },
    fieldIcons: {},
    formatValue: {},
  },
  crmOpportunity: {
    getTitle: (fields) => fields.name || "Unnamed Opportunity",
    icon: <CircleDollarSign className="size-5" />,
    fieldIcons: {
      amount: <DollarSign className="size-4" />,
      stage: <Flag className="size-4" />,
      companies: <Building2 className="size-4" />,
    },
    formatValue: {
      amount: (value) => {
        if (!value) return "0";
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(value);
      },
      stage: (value) => value?.fields?.name || undefined,
      companies: (value) =>
        value?.[0]
          ? value?.[0]?.fields?.name
            ? `${value.map((c: any) => c.name).join(", ")}`
            : `${value?.length || 0} companies`
          : "No company",
    },
  },
};

const DEFAULT_VISIBLE_FIELDS = 3;

export function ResourceCard({
  resource,
  connectorId,
  error,
}: ResourceCardPorps) {
  const [showAllFields, setShowAllFields] = useState(false);

  if (error) return toast.error(JSON.stringify(error));

  if (!resource?.model) return toast.error("Resource model not provided");
  const template = modelTemplates[resource.model];

  const getOrderedFields = () => {
    if (!template) return Object.entries(resource.fields);

    // First get fields that have icons in the specified order
    const orderedFields = Object.keys(template.fieldIcons)
      .filter((key) => resource.fields[key] !== undefined)
      .map((key) => [key, resource.fields[key]]);

    return [...orderedFields];
  };

  const orderedFields = getOrderedFields();
  const visibleFields = showAllFields
    ? orderedFields
    : orderedFields.slice(0, DEFAULT_VISIBLE_FIELDS);
  const hasMoreFields = orderedFields.length > DEFAULT_VISIBLE_FIELDS;

  const formatFieldValue = (key: string, value: any) => {
    if (template?.formatValue?.[key]) {
      return template.formatValue[key](value);
    }
    return typeof value === "object" ? JSON.stringify(value) : String(value);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-1 px-4 pt-4">
          <div className="flex items-center gap-2">
            {template?.icon
              ? typeof template?.icon === "function"
                ? template.icon(resource.fields)
                : template.icon
              : null}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg truncate">
                {template?.getTitle(resource.fields) || resource.model}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-3">
          {visibleFields.map(([key, value]) => {
            const formatedValue = formatFieldValue(key, value);
            if (!formatedValue) return null;
            return (
              <div key={key} className="flex items-start gap-2">
                {template?.fieldIcons[key] && (
                  <div className="mt-1 text-muted-foreground shrink-0">
                    {template.fieldIcons[key]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {formatedValue}
                  </div>
                </div>
              </div>
            );
          })}
          {hasMoreFields && (
            <button
              onClick={() => setShowAllFields(!showAllFields)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center mt-2"
            >
              {showAllFields ? (
                <>
                  Show Less <ChevronUp className="size-4" />
                </>
              ) : (
                <>
                  See More ({orderedFields.length - DEFAULT_VISIBLE_FIELDS}){" "}
                  <ChevronDown className="size-4" />
                </>
              )}
            </button>
          )}
        </CardContent>
      </Card>
      {connectorId ? (
        <div className="flex items-center justify-end gap-2 mt-2">
          <p className="text-muted-foreground">
            {getConnector(connectorId)?.name}
          </p>
          <ConnectorIcon connectorId={connectorId} size={12} />
        </div>
      ) : null}
    </>
  );
}
