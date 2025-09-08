import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, type = "bug" }) => {
  const getStatusConfig = () => {
    if (type === "bug") {
      const configs = {
        new: { variant: "info", icon: "Plus", label: "New" },
        assigned: { variant: "warning", icon: "User", label: "Assigned" },
        "in-progress": { variant: "primary", icon: "Play", label: "In Progress" },
        testing: { variant: "secondary", icon: "TestTube", label: "Testing" },
        resolved: { variant: "success", icon: "Check", label: "Resolved" },
        closed: { variant: "default", icon: "X", label: "Closed" }
      };
      return configs[status] || configs.new;
    }
    
    if (type === "testCase") {
      const configs = {
        draft: { variant: "default", icon: "Edit", label: "Draft" },
        active: { variant: "success", icon: "CheckCircle", label: "Active" },
        deprecated: { variant: "error", icon: "Archive", label: "Deprecated" }
      };
      return configs[status] || configs.draft;
    }

    if (type === "testResult") {
      const configs = {
        pass: { variant: "success", icon: "CheckCircle", label: "Pass" },
        fail: { variant: "error", icon: "XCircle", label: "Fail" },
        blocked: { variant: "warning", icon: "AlertCircle", label: "Blocked" },
        skip: { variant: "default", icon: "SkipForward", label: "Skip" }
      };
      return configs[status] || { variant: "default", icon: "HelpCircle", label: "Unknown" };
    }

    return { variant: "default", icon: "HelpCircle", label: status };
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className="inline-flex items-center gap-1">
      <ApperIcon name={config.icon} className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;