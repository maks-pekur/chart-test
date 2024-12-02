import { useState } from "react";
import CustomSelect from "./custom-select";

export const Filters = ({
  types = [],
  models = [],
  onFilterChange,
}: {
  types: string[];
  models: string[];
  onFilterChange: (filters: { type: string; model: string }) => void;
}) => {
  const [filters, setFilters] = useState({ type: "all", model: "all" });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="flex gap-4">
      <CustomSelect
        options={[
          { value: "all", label: "All Types" },
          ...types.map((type) => ({ value: type, label: type })),
        ]}
        placeholder="Select Type"
        defaultValue="all"
        onValueChange={(value) => handleFilterChange("type", value)}
      />
      <CustomSelect
        options={[
          { value: "all", label: "All Models" },
          ...models.map((model) => ({ value: model, label: model })),
        ]}
        placeholder="Select Model"
        defaultValue="all"
        onValueChange={(value) => handleFilterChange("model", value)}
      />
    </div>
  );
};
