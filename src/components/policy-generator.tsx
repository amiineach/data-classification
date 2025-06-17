"use client";

import { createPolicyData } from "@/actions/policy";
import { Button } from "@/components/ui/button";
import { generateDataClassificationPolicy } from "@/lib/generate-policy-document";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

// Animation variants
const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const buttonVariants = {
  idle: {
    scale: 1,
    boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 6px 20px 0 rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
  loading: {
    scale: 1,
    boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.1)",
  },
};

// const progressVariants = {
//   initial: { width: 0 },
//   animate: {
//     width: "100%",
//     transition: { duration: 2, ease: "easeInOut" },
//   },
// };

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.6, repeat: Infinity },
  },
};

const sparkleVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1, 0],
    opacity: [0, 1, 0],
    transition: { duration: 0.8, repeat: Infinity, repeatDelay: 0.5 },
  },
};

export default function GeneratePolicy({ orgId }: { orgId: string }) {
  const [progress, setProgress] = useState(0);

  // Document generation mutation
  const generateDocumentMutation = useMutation({
    mutationFn: async () => {
      // Step 1: Fetch policy data
      setProgress(25);
      const policyData = await createPolicyData(orgId);

      // Step 2: Generate document
      setProgress(60);
      const blob = await generateDataClassificationPolicy(policyData);

      // Step 3: Complete
      setProgress(100);
      return blob;
    },
    onSuccess: (blob) => {
      // Create download link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Data_Classification_Policy.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Reset progress after a delay
      setTimeout(() => setProgress(0), 2000);
    },
    onError: () => {
      setProgress(0);
    },
  });

  const handleDocGeneration = () => {
    generateDocumentMutation.mutate();
  };

  const getButtonContent = () => {
    if (generateDocumentMutation.isPending) {
      return (
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-5 h-5" />
          </motion.div>
          <span>Generating Document...</span>
        </div>
      );
    }

    if (generateDocumentMutation.isSuccess) {
      return (
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
          </motion.div>
          <span>Document Generated!</span>
        </motion.div>
      );
    }

    if (generateDocumentMutation.isError) {
      return (
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span>Generation Failed</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <FileText className="w-5 h-5" />
        <span>Generate Document</span>
        <motion.div
          variants={sparkleVariants}
          initial="initial"
          animate="animate"
        >
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </motion.div>
      </div>
    );
  };

  const getButtonVariant = () => {
    if (generateDocumentMutation.isSuccess) return "default";
    if (generateDocumentMutation.isError) return "destructive";
    return "default";
  };

  return (
    <motion.div
      className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Policy Document Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            Generate a comprehensive data classification policy document based
            on your organization&apos;s assessment.
          </p>
        </motion.div>

        {/* Document icon animation */}
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-8 relative"
            animate={generateDocumentMutation.isPending ? "pulse" : "initial"}
            variants={iconVariants}
          >
            <div className="w-full h-full bg-white dark:bg-gray-700 rounded-lg shadow-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
              <FileCheck className="w-12 h-12 text-blue-500" />
            </div>

            {/* Animated rings for loading state */}
            <AnimatePresence>
              {generateDocumentMutation.isPending && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 border-2 border-blue-400 rounded-lg opacity-30"
                      initial={{ scale: 1, opacity: 0.3 }}
                      animate={{ scale: 1.5 + i * 0.3, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Progress bar */}
        <AnimatePresence>
          {generateDocumentMutation.isPending && (
            <motion.div
              className="w-80 mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {progress < 30 && "Collecting organization data..."}
                {progress >= 30 &&
                  progress < 70 &&
                  "Generating policy content..."}
                {progress >= 70 && progress < 100 && "Creating document..."}
                {progress === 100 && "Complete!"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate button */}
        <motion.div
          variants={buttonVariants}
          initial="idle"
          whileHover={!generateDocumentMutation.isPending ? "hover" : "loading"}
          whileTap={!generateDocumentMutation.isPending ? "tap" : "loading"}
        >
          <Button
            onClick={handleDocGeneration}
            disabled={generateDocumentMutation.isPending}
            variant={getButtonVariant()}
            size="lg"
            className="px-8 py-6 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200"
          >
            {getButtonContent()}
          </Button>
        </motion.div>

        {/* Status messages */}
        <AnimatePresence mode="wait">
          {generateDocumentMutation.isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
            >
              <Download className="w-5 h-5" />
              <span>Document downloaded successfully!</span>
            </motion.div>
          )}

          {generateDocumentMutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-red-600 dark:text-red-400"
            >
              <p>Failed to generate document. Please try again.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateDocumentMutation.reset()}
                className="mt-2"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
