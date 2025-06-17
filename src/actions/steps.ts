"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";

// ===== First Step =====
export const getFirstStepByOrganizationId = async (organizationId: string) => {
  const result = await db.firstStep.findUnique({
    where: { organizationId },
  });

  // Return null if no record found, or ensure data structure is correct
  if (!result) {
    return null;
  }

  // Ensure the data property exists and has the expected structure
  return {
    ...result,
    data: result.data || {
      primaryObjectives: {
        selected: [],
        other: [],
      },
      organizationSize: "",
      stakeholders: {
        selected: [],
        other: [],
      },
      regulations: {
        selected: [],
        other: [],
      },
    },
  };
};

export const updateFirstStepByOrganizationId = async (
  organizationId: string,
  newData: any
) => {
  return await db.firstStep.upsert({
    where: { organizationId },
    update: { data: newData },
    create: {
      organizationId,
      data: newData,
    },
  });
};

// ===== Second Step =====
export const getSecondStepByOrganizationId = async (organizationId: string) => {
  const result = await db.secondStep.findUnique({
    where: { organizationId },
  });

  if (!result) {
    return null;
  }

  // Return in the expected Step2Result format
  return {
    step: 2,
    title: "Data Landscape",
    data: result.data || {
      hasInventory: "",
      selectedDataTypes: [],
      customDataTypes: [],
      dataTypeDetails: {},
      inventoryData: null,
    },
    timestamp: result.createdAt?.toISOString() || new Date().toISOString(),
  };
};

export const updateSecondStepByOrganizationId = async (
  organizationId: string,
  newData: any
) => {
  return await db.secondStep.upsert({
    where: { organizationId },
    update: { data: newData },
    create: {
      organizationId,
      data: newData,
    },
  });
};

// ===== Third Step =====
export const getThirdStepByOrganizationId = async (organizationId: string) => {
  const result = await db.thirdStep.findUnique({
    where: { organizationId },
  });

  if (!result) {
    return null;
  }

  return {
    step: 3,
    title: "Third Step",
    data: result.data || {},
    timestamp: result.createdAt?.toISOString() || new Date().toISOString(),
  };
};

export const updateThirdStepByOrganizationId = async (
  organizationId: string,
  newData: any
) => {
  return await db.thirdStep.upsert({
    where: { organizationId },
    update: { data: newData },
    create: {
      organizationId,
      data: newData,
    },
  });
};

// ===== Fourth Step =====
export const getFourthStepByOrganizationId = async (organizationId: string) => {
  const result = await db.fourthStep.findUnique({
    where: { organizationId },
  });

  if (!result) {
    return null;
  }

  return {
    step: 4,
    title: "Fourth Step",
    data: result.data || {},
    timestamp: result.createdAt?.toISOString() || new Date().toISOString(),
  };
};

export const updateFourthStepByOrganizationId = async (
  organizationId: string,
  newData: any
) => {
  return await db.fourthStep.upsert({
    where: { organizationId },
    update: { data: newData },
    create: {
      organizationId,
      data: newData,
    },
  });
};
