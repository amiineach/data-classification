"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import { updateFirstStepByOrganizationId } from "@/actions/steps";
import { useRouter } from "next/navigation";

export type Step1Data = {
  primaryObjectives: {
    selected: string[];
    other: string[];
  };
  organizationSize: string;
  stakeholders: {
    selected: string[];
    other: string[];
  };
  regulations: {
    selected: string[];
    other: string[];
  };
};

export type Step1Result = {
  step: number;
  title: string;
  data: Step1Data;
  timestamp: string;
};

interface FormData {
  primaryObjectives: string[];
  primaryObjectivesOther: string[];
  organizationSize: string;
  stakeholders: string[];
  stakeholdersOther: string[];
  regulations: string[];
  regulationsOther: string[];
}

type OtherCategory =
  | "primaryObjectivesOther"
  | "stakeholdersOther"
  | "regulationsOther";

interface Step1Props {
  initialData?: Step1Result | null;
  organizationId: string;
}

export default function Step1({ initialData, organizationId }: Step1Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData?.data) {
      return {
        primaryObjectives: initialData.data.primaryObjectives.selected,
        primaryObjectivesOther: initialData.data.primaryObjectives.other,
        organizationSize: initialData.data.organizationSize,
        stakeholders: initialData.data.stakeholders.selected,
        stakeholdersOther: initialData.data.stakeholders.other,
        regulations: initialData.data.regulations.selected,
        regulationsOther: initialData.data.regulations.other,
      };
    }
    return {
      primaryObjectives: [],
      primaryObjectivesOther: [],
      organizationSize: "",
      stakeholders: [],
      stakeholdersOther: [],
      regulations: [],
      regulationsOther: [],
    };
  });

  // React Query mutation for updating first step
  const updateFirstStepMutation = useMutation({
    mutationFn: async (data: Step1Result) =>
      await updateFirstStepByOrganizationId(organizationId, data),
    onSuccess: () => {
      router.push(`/projects/${organizationId}/step2`);
      toast.success("Step 1 data saved successfully!", {
        duration: 4000,
        position: "top-right",
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to save Step 1 data: ${error.message}`, {
        duration: 5000,
        position: "top-right",
      });
    },
  });

  const primaryObjectiveOptions = [
    "Enhance data security by identifying and protecting sensitive information.",
    "Ensure compliance with legal and regulatory requirements.",
    "Improve data handling by defining access and usage guidelines.",
    "Mitigate risks of data breaches or unauthorized access.",
    "Streamline data management and resource allocation.",
  ];

  const stakeholderOptions = [
    "Data Owners",
    "Data Stewards",
    "IT / Security Teams",
    "Compliance / Legal Teams",
    "Executive Management",
    "Business Units",
  ];

  const regulationOptions = [
    "GDPR",
    "Algerian Law 18.07",
    "PCI DSS",
    "ISO/IEC 27001",
    "Basel III",
  ];

  const handleObjectiveChange = (objective: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      primaryObjectives: checked
        ? [...prev.primaryObjectives, objective]
        : prev.primaryObjectives.filter((item) => item !== objective),
    }));
  };

  const handleStakeholderChange = (stakeholder: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      stakeholders: checked
        ? [...prev.stakeholders, stakeholder]
        : prev.stakeholders.filter((item) => item !== stakeholder),
    }));
  };

  const handleRegulationChange = (regulation: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      regulations: checked
        ? [...prev.regulations, regulation]
        : prev.regulations.filter((item) => item !== regulation),
    }));
  };

  const addOtherItem = (category: OtherCategory) => {
    setFormData((prev) => ({
      ...prev,
      [category]: [...prev[category], ""],
    }));
  };

  const updateOtherItem = (
    category: OtherCategory,
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeOtherItem = (category: OtherCategory, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    const results: Step1Result = {
      step: 1,
      title: "Understand Organization & Stakeholders",
      data: {
        primaryObjectives: {
          selected: formData.primaryObjectives,
          other: formData.primaryObjectivesOther.filter(
            (item) => item.trim() !== ""
          ),
        },
        organizationSize: formData.organizationSize,
        stakeholders: {
          selected: formData.stakeholders,
          other: formData.stakeholdersOther.filter(
            (item) => item.trim() !== ""
          ),
        },
        regulations: {
          selected: formData.regulations,
          other: formData.regulationsOther.filter((item) => item.trim() !== ""),
        },
      },
      timestamp: new Date().toISOString(),
    };

    // Trigger the mutation to save the data
    updateFirstStepMutation.mutate(results);
  };

  const isLoading = updateFirstStepMutation.isPending;

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
            Step 1: Understand Organization & Stakeholders
          </CardTitle>
          <CardDescription>
            This step helps us understand your organization&apos;s objectives
            and stakeholder structure for implementing a Data Classification
            Policy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Question 1.1 - Primary Objectives */}
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold primary-color">
                1.1 What is the primary objective of implementing a Data
                Classification Policy?
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Select all that apply
              </p>
            </div>
            <div className="space-y-3">
              {primaryObjectiveOptions.map((objective, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Checkbox
                    id={`objective-${index}`}
                    checked={formData.primaryObjectives.includes(objective)}
                    onCheckedChange={(checked) =>
                      handleObjectiveChange(objective, !!checked)
                    }
                    className="mt-1 primary-border"
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor={`objective-${index}`}
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    {objective}
                  </Label>
                </div>
              ))}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Other objectives:</Label>
                {formData.primaryObjectivesOther.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Please specify..."
                      value={item}
                      onChange={(e) =>
                        updateOtherItem(
                          "primaryObjectivesOther",
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        removeOtherItem("primaryObjectivesOther", index)
                      }
                      className="hover-primary"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addOtherItem("primaryObjectivesOther")}
                  className="hover-primary"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Other Objective
                </Button>
              </div>
            </div>
          </div>

          {/* Question 1.2 - Organization Size */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold primary-color">
              1.2 How large is your organization in terms of data volume?
            </Label>
            <RadioGroup
              value={formData.organizationSize}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, organizationSize: value }))
              }
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="small"
                  id="size-small"
                  className="primary-border"
                  disabled={isLoading}
                />
                <Label htmlFor="size-small">Small (&lt;100GB)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="medium"
                  id="size-medium"
                  className="primary-border"
                  disabled={isLoading}
                />
                <Label htmlFor="size-medium">Medium (100GB-1TB)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="large"
                  id="size-large"
                  className="primary-border"
                  disabled={isLoading}
                />
                <Label htmlFor="size-large">Large (&gt;1TB)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 1.3 - Stakeholders */}
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold primary-color">
                1.3 Who are the stakeholders involved in data governance and
                classification?
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Select all that apply
              </p>
            </div>
            <div className="space-y-3">
              {stakeholderOptions.map((stakeholder, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    id={`stakeholder-${index}`}
                    checked={formData.stakeholders.includes(stakeholder)}
                    onCheckedChange={(checked) =>
                      handleStakeholderChange(stakeholder, !!checked)
                    }
                    className="primary-border"
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor={`stakeholder-${index}`}
                    className="text-sm cursor-pointer"
                  >
                    {stakeholder}
                  </Label>
                </div>
              ))}

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Other stakeholders:
                </Label>
                {formData.stakeholdersOther.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Please specify..."
                      value={item}
                      onChange={(e) =>
                        updateOtherItem(
                          "stakeholdersOther",
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        removeOtherItem("stakeholdersOther", index)
                      }
                      className="hover-primary"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addOtherItem("stakeholdersOther")}
                  className="hover-primary"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Other Stakeholder
                </Button>
              </div>
            </div>
          </div>

          {/* Question 1.4 - Regulations */}
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold primary-color">
                1.4 Are there any laws or regulations that apply to your data?
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Select all that apply
              </p>
            </div>
            <div className="space-y-3">
              {regulationOptions.map((regulation, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    id={`regulation-${index}`}
                    checked={formData.regulations.includes(regulation)}
                    onCheckedChange={(checked) =>
                      handleRegulationChange(regulation, !!checked)
                    }
                    className="primary-border"
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor={`regulation-${index}`}
                    className="text-sm cursor-pointer"
                  >
                    {regulation}
                  </Label>
                </div>
              ))}

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Other regulations:
                </Label>
                {formData.regulationsOther.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder="Please specify..."
                      value={item}
                      onChange={(e) =>
                        updateOtherItem(
                          "regulationsOther",
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeOtherItem("regulationsOther", index)}
                      className="hover-primary"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addOtherItem("regulationsOther")}
                  className="hover-primary"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Other Regulation
                </Button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 w-full flex items-center justify-end  gap-x-4">
            <Button
              onClick={handleSubmit}
              className="w-full md:w-auto primary-bg hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
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
