"use client";

import { motion } from "framer-motion";
import SignupForm from "@/components/auth/signup.form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Left side - Background with branding */}
      <motion.div
        className="hidden md:flex md:w-2/5 bg-[#792a9f] flex-col justify-center items-center p-8 text-white relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative z-10">
          <motion.h1
            className="text-4xl font-bold italic mb-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            data classification
          </motion.h1>

          <motion.div
            className="h-1 w-24 bg-white rounded mb-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          />

          <motion.p
            className="text-lg max-w-sm opacity-90"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Join our platform to simplify your data management workflow
          </motion.p>
        </div>

        {/* Animated background patterns */}
        <motion.div
          className="absolute inset-0 opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full border-8 border-white" />
          <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full border-8 border-white" />
          <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full border-4 border-white" />
        </motion.div>
      </motion.div>

      {/* Right side - Signup form (client component) */}
      <motion.div
        className="w-full md:w-3/5 flex justify-center items-center p-6 sm:p-8 lg:p-12"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo display */}
          <motion.div
            className="md:hidden text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold italic text-[#792a9f]">
              data classification
            </h1>
            <motion.div
              className="h-1 w-16 bg-[#792a9f] rounded mx-auto mt-1"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <SignupForm />

            {/* Already have an account link */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#792a9f] hover:text-[#5f217f] font-medium"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
