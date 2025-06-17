/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { updateFourthStepByOrganizationId } from "@/actions/steps";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Define types for the component
export interface Step4Data {
  accessPermissions: Record<string, string[]>;
  encryptionProtocols: Record<string, string[]>;
  customRoles: string[];
  customEncryption: string[];
}

interface Step4Props {
  classifications: any[];
  organizationId: string;
  initialData?: Step4Data;
}

export default function Step4({
  classifications,
  organizationId,
  initialData,
}: Step4Props) {
  const router = useRouter();
  // Predefined roles
  const predefinedRoles = [
    "All users",
    "All employees",
    "Customer Service",
    "Compliance",
    "C-level executives",
    "IT admins",
    "Managers",
    "Finance",
    "Human Resources",
    "Marketing",
    "Legal",
    "External Partners",
    "None",
  ];

  // Predefined encryption types
  const encryptionTypes = [
    "None",
    "AES-128",
    "AES-256",
    "TLS 1.2",
    "TLS 1.3",
    "RSA-2048",
    "BitLocker",
    "HTTPS",
    "PGP",
    "SSH",
    "S/MIME",
  ];

  // Initialize state with initialData
  const [customRoles, setCustomRoles] = useState<string[]>(
    initialData?.customRoles || []
  );
  const [customEncryption, setCustomEncryption] = useState<string[]>(
    initialData?.customEncryption || []
  );

  const [accessPermissions, setAccessPermissions] = useState<
    Record<string, string[]>
  >(
    initialData?.accessPermissions || {
      Public: ["All users"],
      Internal: ["All employees"],
      Confidential: ["Customer Service", "Compliance"],
      Restricted: ["C-level executives", "IT admins"],
    }
  );

  const [encryptionProtocols, setEncryptionProtocols] = useState<
    Record<string, string[]>
  >(
    initialData?.encryptionProtocols || {
      Public: ["None"],
      Internal: ["TLS 1.3"],
      Confidential: ["AES-256", "TLS 1.3"],
      Restricted: ["AES-256", "BitLocker"],
    }
  );

  // Setup React Query mutation
  const mutation = useMutation({
    mutationFn: (data: { organizationId: string; newData: any }) => {
      return updateFourthStepByOrganizationId(
        data.organizationId,
        data.newData
      );
    },
    onSuccess: () => {
      router.push(`/projects/${organizationId}/generate-doc`);
      toast(
        "Access controls and security measures have been saved successfully."
      );
    },
    onError: (error) => {
      toast("Failed to save access controls data. Please try again.");
      console.error("Error saving Step 4 data:", error);
    },
  });

  // Handle custom role changes
  const addCustomRole = () => {
    setCustomRoles([...customRoles, ""]);
  };

  const updateCustomRole = (index: number, value: string) => {
    const updated = [...customRoles];
    updated[index] = value;
    setCustomRoles(updated);
  };

  const removeCustomRole = (index: number) => {
    const roleToRemove = customRoles[index];
    setCustomRoles(customRoles.filter((_, i) => i !== index));

    // Remove this role from any classification level that uses it
    const updatedAccessPermissions = { ...accessPermissions };
    Object.keys(updatedAccessPermissions).forEach((level) => {
      if (updatedAccessPermissions[level].includes(roleToRemove)) {
        updatedAccessPermissions[level] = updatedAccessPermissions[
          level
        ].filter((role) => role !== roleToRemove);
      }
    });
    setAccessPermissions(updatedAccessPermissions);
  };

  // Handle custom encryption changes
  const addCustomEncryption = () => {
    setCustomEncryption([...customEncryption, ""]);
  };

  const updateCustomEncryption = (index: number, value: string) => {
    const updated = [...customEncryption];
    updated[index] = value;
    setCustomEncryption(updated);
  };

  const removeCustomEncryption = (index: number) => {
    const encryptionToRemove = customEncryption[index];
    setCustomEncryption(customEncryption.filter((_, i) => i !== index));

    // Remove this encryption from any classification level that uses it
    const updatedEncryptionProtocols = { ...encryptionProtocols };
    Object.keys(updatedEncryptionProtocols).forEach((level) => {
      if (updatedEncryptionProtocols[level].includes(encryptionToRemove)) {
        updatedEncryptionProtocols[level] = updatedEncryptionProtocols[
          level
        ].filter((enc) => enc !== encryptionToRemove);
      }
    });
    setEncryptionProtocols(updatedEncryptionProtocols);
  };

  // Handle role selection for a classification level
  const toggleRoleForLevel = (level: string, role: string) => {
    const currentRoles = accessPermissions[level] || [];

    // Special handling for "All users" and "All employees"
    if (role === "All users") {
      // If selecting "All users", remove "All employees" if present
      if (!currentRoles.includes(role)) {
        setAccessPermissions({
          ...accessPermissions,
          [level]: [
            role,
            ...currentRoles.filter(
              (r) => r !== "All employees" && r !== "None"
            ),
          ],
        });
      } else {
        setAccessPermissions({
          ...accessPermissions,
          [level]: currentRoles.filter((r) => r !== role),
        });
      }
    } else if (role === "All employees") {
      // If selecting "All employees", remove "All users" if present
      if (!currentRoles.includes(role)) {
        setAccessPermissions({
          ...accessPermissions,
          [level]: [
            role,
            ...currentRoles.filter((r) => r !== "All users" && r !== "None"),
          ],
        });
      } else {
        setAccessPermissions({
          ...accessPermissions,
          [level]: currentRoles.filter((r) => r !== role),
        });
      }
    } else if (role === "None") {
      // If selecting "None", remove all other roles
      if (!currentRoles.includes(role)) {
        setAccessPermissions({
          ...accessPermissions,
          [level]: [role],
        });
      } else {
        setAccessPermissions({
          ...accessPermissions,
          [level]: [],
        });
      }
    } else {
      // For any other role
      if (currentRoles.includes("None")) {
        // If "None" is selected, remove it and add this role
        setAccessPermissions({
          ...accessPermissions,
          [level]: [role],
        });
      } else if (currentRoles.includes(role)) {
        // If role is already selected, remove it
        setAccessPermissions({
          ...accessPermissions,
          [level]: currentRoles.filter((r) => r !== role),
        });
      } else {
        // Otherwise add it, but remove "All users" or "All employees" if the other is being selected
        if (role !== "All users" && role !== "All employees") {
          setAccessPermissions({
            ...accessPermissions,
            [level]: [...currentRoles, role],
          });
        }
      }
    }
  };

  // Handle encryption selection for a classification level
  const toggleEncryptionForLevel = (level: string, encryption: string) => {
    const currentEncryption = encryptionProtocols[level] || [];

    // Special handling for "None"
    if (encryption === "None") {
      if (!currentEncryption.includes(encryption)) {
        setEncryptionProtocols({
          ...encryptionProtocols,
          [level]: [encryption],
        });
      } else {
        setEncryptionProtocols({
          ...encryptionProtocols,
          [level]: [],
        });
      }
    } else {
      if (currentEncryption.includes("None")) {
        // If "None" is selected, remove it and add this encryption
        setEncryptionProtocols({
          ...encryptionProtocols,
          [level]: [encryption],
        });
      } else if (currentEncryption.includes(encryption)) {
        // If encryption is already selected, remove it
        setEncryptionProtocols({
          ...encryptionProtocols,
          [level]: currentEncryption.filter((e) => e !== encryption),
        });
      } else {
        // Otherwise add it
        setEncryptionProtocols({
          ...encryptionProtocols,
          [level]: [...currentEncryption, encryption],
        });
      }
    }
  };

  // Get all available roles
  const getAllRoles = () => {
    return [
      ...predefinedRoles,
      ...customRoles.filter((role) => role.trim() !== ""),
    ];
  };

  // Get all available encryption types
  const getAllEncryptionTypes = () => {
    return [
      ...encryptionTypes,
      ...customEncryption.filter((enc) => enc.trim() !== ""),
    ];
  };

  const handleSubmit = () => {
    const stepData = {
      step: 4,
      title: "Access Controls and Security Measures",
      data: {
        accessPermissions: { ...accessPermissions },
        encryptionProtocols: { ...encryptionProtocols },
        customRoles: customRoles.filter((role) => role.trim() !== ""),
        customEncryption: customEncryption.filter((enc) => enc.trim() !== ""),
      },
      timestamp: new Date().toISOString(),
    };

    console.log("Step 4 Results:", JSON.stringify(stepData, null, 2));

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
            Step 4: Access Controls and Security Measures
          </CardTitle>
          <CardDescription>
            Define who should have access to each classification level and what
            encryption protocols should be used.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Additional information box */}
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h4 className="font-semibold primary-color mb-2">
              Recommended Security Measures
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              Suggested security measures by classification level:
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <span className="font-medium">Public:</span> Basic protection,
                typically no encryption needed except for web traffic (HTTPS).
              </li>
              <li>
                <span className="font-medium">Internal:</span> Standard
                encryption for transit (TLS 1.3), basic access controls.
              </li>
              <li>
                <span className="font-medium">Confidential:</span> Strong
                encryption both at rest (AES-256) and in transit (TLS 1.3),
                role-based access controls.
              </li>
              <li>
                <span className="font-medium">Restricted:</span> Maximum
                protection with multiple encryption layers (AES-256, BitLocker),
                strict access controls, and additional security measures.
              </li>
            </ul>
          </div>

          {/* Question 4.1 - Access Permissions */}
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-semibold primary-color">
                4.1 Define Access Permissions
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Select which roles should have access to each classification
                level.
              </p>
            </div>

            {/* Custom Roles Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Add custom roles if needed:
              </Label>
              {customRoles.map((role, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="e.g., Data Scientists"
                    value={role}
                    onChange={(e) => updateCustomRole(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCustomRole(index)}
                    className="hover-primary"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addCustomRole}
                className="hover-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Role
              </Button>
            </div>

            {/* Access Permissions Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    Classification Level
                  </TableHead>
                  <TableHead>Roles with Access</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classifications.map((level) => (
                  <TableRow key={level}>
                    <TableCell className="font-medium">{level}</TableCell>
                    <TableCell>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {getAllRoles().map((role, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={`${level}-role-${index}`}
                              checked={
                                accessPermissions[level]?.includes(role) ||
                                false
                              }
                              onCheckedChange={() =>
                                toggleRoleForLevel(level, role)
                              }
                              className="primary-border"
                            />
                            <Label
                              htmlFor={`${level}-role-${index}`}
                              className="text-sm cursor-pointer"
                            >
                              {role}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Question 4.4 - Encryption Protocols */}
          <div className="space-y-4 pt-6">
            <div>
              <Label className="text-lg font-semibold primary-color">
                4.4 Define Encryption Protocols
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Select which encryption protocols should be used for each
                classification level.
              </p>
            </div>

            {/* Custom Encryption Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Add custom encryption protocols if needed:
              </Label>
              {customEncryption.map((encryption, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="e.g., ChaCha20-Poly1305"
                    value={encryption}
                    onChange={(e) =>
                      updateCustomEncryption(index, e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCustomEncryption(index)}
                    className="hover-primary"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addCustomEncryption}
                className="hover-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Encryption
              </Button>
            </div>

            {/* Encryption Protocols Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    Classification Level
                  </TableHead>
                  <TableHead>Encryption Protocols</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classifications.map((level) => (
                  <TableRow key={level}>
                    <TableCell className="font-medium">{level}</TableCell>
                    <TableCell>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {getAllEncryptionTypes().map((encryption, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={`${level}-enc-${index}`}
                              checked={
                                encryptionProtocols[level]?.includes(
                                  encryption
                                ) || false
                              }
                              onCheckedChange={() =>
                                toggleEncryptionForLevel(level, encryption)
                              }
                              className="primary-border"
                            />
                            <Label
                              htmlFor={`${level}-enc-${index}`}
                              className="text-sm cursor-pointer"
                            >
                              {encryption}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Submit Button */}
          <div className="pt-6 w-full flex items-center justify-end  gap-x-4">
            <Button
              onClick={() => router.push(`/projects/${organizationId}/step3`)}
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
                "save & next"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
