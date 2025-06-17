import { DataTypeDetail, Step2Data } from "@/components/forms/step2";

type GroupedDataType = {
  dataTypes: string[];
  detail: DataTypeDetail;
};

export function groupDataTypesByDetail(
  step2Data: Step2Data
): GroupedDataType[] {
  const groups: GroupedDataType[] = [];

  for (const [dataType, detail] of Object.entries(step2Data.dataTypeDetails)) {
    // Check if a group with same detail already exists
    const existingGroup = groups.find((group) =>
      isSameDetail(group.detail, detail)
    );

    if (existingGroup) {
      existingGroup.dataTypes.push(dataType);
    } else {
      groups.push({
        dataTypes: [dataType],
        detail,
      });
    }
  }

  return groups;
}

function isSameDetail(a: DataTypeDetail, b: DataTypeDetail): boolean {
  return (
    a.sensitivity === b.sensitivity &&
    a.businessImpact === b.businessImpact &&
    a.hasRegulatory === b.hasRegulatory &&
    arraysEqual(a.regulations, b.regulations) &&
    arraysEqual(a.storage, b.storage) &&
    arraysEqual(a.storageOther, b.storageOther)
  );
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
}
