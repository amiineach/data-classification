"use client";

// import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    name: "Organization",
    description: "Understand organization & stakeholders",
    path: "step1",
  },
  {
    id: 2,
    name: "Data Landscape",
    description: "Identify data types and sensitivity",
    path: "step2",
  },
  {
    id: 3,
    name: "Classification",
    description: "Define classification levels",
    path: "step3",
  },
  {
    id: 4,
    name: "Access Controls",
    description: "Set security measures",
    path: "step4",
  },
  {
    id: 5,
    name: "Document Generation",
    description: "Generate policy documents",
    path: "step5",
  },
];

export function ProgressSteps({ projectId }: { projectId: string }) {
  console.log(projectId);
  const pathname = usePathname();
  // This new logic is more robust and correctly finds the step number.
const match = pathname.match(/step(\d+)/);
const currentStep = match ? parseInt(match[1], 10) : 1;
  const totalSteps = steps.length;

  return (
    <div className="relative py-12 px-8 bg-white/80 backdrop-blur-sm mt-8 mb-2 rounded-2xl border border-gray-100 mx-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Progress Line */}
      <div className="absolute top-[3.5rem] left-12 right-12 h-0.5 bg-gray-100 rounded-full">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Step Circles */}
      <div className="flex justify-between relative z-10">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center group cursor-pointer"
          >
            {/* Circle */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 transform hover:scale-105",
                currentStep === step.id
                  ? "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                  : currentStep > step.id
                  ? "border-purple-500 bg-purple-500 text-white shadow-md shadow-purple-500/20"
                  : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
              )}
            >
              {currentStep > step.id ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span className="text-sm font-semibold">{step.id}</span>
              )}
            </div>

            {/* Step Name */}
            <div className="mt-4 text-center">
              <span
                className={cn(
                  "block text-sm font-medium transition-all duration-300",
                  currentStep === step.id
                    ? "text-indigo-600"
                    : currentStep > step.id
                    ? "text-purple-600"
                    : "text-gray-500"
                )}
              >
                {step.name}
              </span>

              {/* Description - only show on larger screens */}
              <span
                className={cn(
                  "block text-xs mt-1 max-w-[100px] transition-all duration-300 leading-relaxed",
                  currentStep === step.id
                    ? "text-indigo-500"
                    : currentStep > step.id
                    ? "text-purple-500"
                    : "text-gray-400",
                  "hidden sm:block"
                )}
              >
                {step.description}
              </span>
            </div>

            {/* Active indicator dot */}
            {currentStep === step.id && (
              <div className="absolute -bottom-2 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* Step counter */}
      <div className="absolute top-4 right-6 text-xs text-gray-400 font-medium">
        {currentStep} of {totalSteps}
      </div>
    </div>
  );
}
