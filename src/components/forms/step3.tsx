/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { updateThirdStepByOrganizationId } from "@/actions/steps";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CategoryData {
  dataTypes: string[];
  detail: {
    storage: string[];
    regulations: string[];
    sensitivity: string;
    storageOther: string[];
    hasRegulatory: string;
    businessImpact: string;
  };
}

export interface Step3Data {
  classificationLevels: {
    defaultLevels: string[];
    customLevels: string[];
    definitions: Record<string, string>;
  };
  dataCategories: {
    name: string;
    description: string;
    examples: string;
    classification: string;
  }[];
}

interface Step3Props {
  initialData?: Step3Data;
  categoryData: CategoryData[];
  organizationId: string; // Add organizationId prop to pass to the mutation
}

interface DataCategory {
  name: string;
  description: string;
  examples: string;
  classification: string;
}

export default function Step3({
  categoryData = [],
  initialData,
  organizationId,
}: Step3Props) {
  const router = useRouter();
  const defaultLevels = [
    { name: "Public", selected: false },
    { name: "Internal", selected: false },
    { name: "Confidential", selected: false },
    { name: "Restricted", selected: false },
  ];

  // Initialize state with initialData
  const [classificationLevels, setClassificationLevels] = useState(() => {
    if (initialData?.classificationLevels?.defaultLevels) {
      return defaultLevels.map((level) => ({
        ...level,
        selected: initialData.classificationLevels.defaultLevels.includes(
          level.name
        ),
      }));
    }
    return defaultLevels;
  });

  const [customLevels, setCustomLevels] = useState<string[]>(
    initialData?.classificationLevels?.customLevels || []
  );

  const [levelDefinitions, setLevelDefinitions] = useState<
    Record<string, string>
  >(
    initialData?.classificationLevels?.definitions || {
      Public: "",
      Internal: "",
      Confidential: "",
      Restricted: "",
    }
  );

  const [dataCategories, setDataCategories] = useState<DataCategory[]>(() => {
    if (initialData?.dataCategories) {
      return initialData.dataCategories;
    } else if (categoryData.length > 0) {
      return categoryData.map((category) => ({
        name: category.dataTypes.join(", "),
        description: `Sensitivity: ${category.detail.sensitivity}, Impact: ${category.detail.businessImpact}`,
        examples: category.detail.storage
          .concat(category.detail.storageOther)
          .join(", "),
        classification: "",
      }));
    }
    return [];
  });

  // Update definitions when custom levels change
  useEffect(() => {
    if (initialData?.classificationLevels?.definitions) {
      setLevelDefinitions(initialData.classificationLevels.definitions);
    }
  }, [initialData]);

  const addCustomLevel = () => {
    setCustomLevels([...customLevels, ""]);
  };

  const updateCustomLevel = (index: number, value: string) => {
    const updated = [...customLevels];
    updated[index] = value;
    setCustomLevels(updated);

    if (value && !levelDefinitions[value]) {
      setLevelDefinitions((prev) => ({ ...prev, [value]: "" }));
    }
  };

  const removeCustomLevel = (index: number) => {
    const levelToRemove = customLevels[index];
    const updatedCustomLevels = customLevels.filter((_, i) => i !== index);
    setCustomLevels(updatedCustomLevels);

    if (levelToRemove) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [levelToRemove]: _, ...updatedDefinitions } = levelDefinitions;
      setLevelDefinitions(updatedDefinitions);

      setDataCategories((categories) =>
        categories.map((category) => ({
          ...category,
          classification:
            category.classification === levelToRemove
              ? ""
              : category.classification,
        }))
      );
    }
  };

  const toggleDefaultLevel = (index: number) => {
    const updated = [...classificationLevels];
    updated[index].selected = !updated[index].selected;
    setClassificationLevels(updated);
  };

  const updateLevelDefinition = (level: string, definition: string) => {
    setLevelDefinitions((prev) => ({ ...prev, [level]: definition }));
  };

  const addDataCategory = () => {
    setDataCategories([
      ...dataCategories,
      { name: "", description: "", examples: "", classification: "" },
    ]);
  };

  const updateDataCategory = (
    index: number,
    field: keyof DataCategory,
    value: string
  ) => {
    const updated = [...dataCategories];
    updated[index][field] = value;
    setDataCategories(updated);
  };

  const removeDataCategory = (index: number) => {
    setDataCategories((categories) => categories.filter((_, i) => i !== index));
  };

  const getAllLevels = () => {
    const defaultSelected = classificationLevels
      .filter((level) => level.selected)
      .map((level) => level.name);

    return [
      ...defaultSelected,
      ...customLevels.filter((level) => level.trim() !== ""),
    ];
  };

  // Setup React Query mutation
  const mutation = useMutation({
    mutationFn: (data: { organizationId: string; newData: any }) => {
      return updateThirdStepByOrganizationId(data.organizationId, data.newData);
    },
    onSuccess: () => {
      router.push(`/projects/${organizationId}/step4`);
      toast(
        "Classification levels and categories have been saved successfully."
      );
    },
    onError: (error) => {
      toast("Failed to save classification data. Please try again.");
      console.error("Error saving Step 3 data:", error);
    },
  });

  const handleSubmit = () => {
    const stepData = {
      step: 3,
      title: "Classification Levels and Categories",
      data: {
        classificationLevels: {
          defaultLevels: classificationLevels
            .filter((level) => level.selected)
            .map((level) => level.name),
          customLevels: customLevels.filter((level) => level.trim() !== ""),
          definitions: Object.fromEntries(
            Object.entries(levelDefinitions).filter(([key]) =>
              getAllLevels().includes(key)
            )
          ),
        },
        dataCategories: dataCategories.filter(
          (category) => category.name.trim() !== ""
        ),
      },
      timestamp: new Date().toISOString(),
    };

    console.log("Step 3 Results:", JSON.stringify(stepData, null, 2));

    // Execute the mutation with organizationId and the new data
    mutation.mutate({
      organizationId,
      newData: stepData,
    });
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <style jsx>{`
        .primary-color {
          color: #792a9f;
        }
        .primary-bg {
          background-color: #792a9f;
        }
        .primary-border {
          border-color: #792a9f;
        }
        .hover-primary:hover {
          background-color: #792a9f;
          color: white;
        }
      `}</style>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl primary-color">
            Step 3: Define Classification Levels and Categories
          </CardTitle>
          <CardDescription>
            Define the data classification levels used in your organization and
            assign them to your data categories.
          </CardDescription>
        </CardHeader>

        <div className="mt-8 p-4 bg-gray-50 rounded-md m-4">
          <h4 className="font-semibold primary-color mb-2">
            Classification Level Guidelines
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            Recommended classification assignment based on standard norms:
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>
              <span className="font-medium">Public:</span> None/Low sensitivity,
              None/Low impact, No regulations.
            </li>
            <li>
              <span className="font-medium">Internal:</span> Low/Medium
              sensitivity, Low/Medium impact, minimal/no regulations.
            </li>
            <li>
              <span className="font-medium">Confidential:</span> Medium/High
              sensitivity, Medium/High impact, regulatory protection.
            </li>
            <li>
              <span className="font-medium">Restricted:</span> High sensitivity,
              High impact, critical regulations or business-critical (e.g.,
              trade secrets).
            </li>
          </ul>
        </div>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold primary-color">
                3.1 What classification levels does your organization use to
                categorize data?
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Select the levels that apply to your organization or add custom
                ones.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Standard levels:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {classificationLevels.map((level, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Checkbox
                      id={`level-${index}`}
                      checked={level.selected}
                      onCheckedChange={() => toggleDefaultLevel(index)}
                      className="primary-border"
                    />
                    <Label
                      htmlFor={`level-${index}`}
                      className="text-sm cursor-pointer"
                    >
                      {level.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Custom classification levels:
              </Label>
              {customLevels.map((level, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="e.g., Highly Sensitive"
                    value={level}
                    onChange={(e) => updateCustomLevel(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCustomLevel(index)}
                    className="hover-primary"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addCustomLevel}
                className="hover-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Level
              </Button>
            </div>

            <div className="pt-6 space-y-4">
              <Label className="text-lg font-semibold primary-color">
                3.2 Define your classification levels
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Please provide a definition for each classification level your
                organization uses.
              </p>

              <div className="space-y-4">
                {getAllLevels().map((level, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`def-${level}`} className="font-medium">
                      {level}
                    </Label>
                    <Textarea
                      id={`def-${level}`}
                      placeholder={`Define the ${level} classification level...`}
                      value={levelDefinitions[level] || ""}
                      onChange={(e) =>
                        updateLevelDefinition(level, e.target.value)
                      }
                      className="min-h-20"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <div>
              <Label className="text-lg font-semibold primary-color">
                3.3 Data Categories and Classification Assignment
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Assign classification levels to your data categories
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Category</TableHead>
                  <TableHead className="w-[200px]">Description</TableHead>
                  <TableHead className="w-[200px]">Examples</TableHead>
                  <TableHead className="w-[120px]">Classification</TableHead>
                  <TableHead className="w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataCategories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={category.name}
                        onChange={(e) =>
                          updateDataCategory(index, "name", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={category.description}
                        onChange={(e) =>
                          updateDataCategory(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={category.examples}
                        onChange={(e) =>
                          updateDataCategory(index, "examples", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={category.classification}
                        onValueChange={(value) =>
                          updateDataCategory(index, "classification", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAllLevels().map((level, i) => (
                            <SelectItem key={i} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDataCategory(index)}
                        className="hover-primary"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button
              variant="outline"
              size="sm"
              onClick={addDataCategory}
              className="hover-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Data Category
            </Button>
          </div>

          {/* Submit Button */}
          <div className="pt-6 w-full flex items-center justify-end  gap-x-4">
            <Button
              onClick={() => router.push(`/projects/${organizationId}/step2`)}
              variant={"outline"}
            >
              previous
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-full md:w-auto primary-bg hover:opacity-90"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "save & go next"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
