"use client";
import Image from "next/image";
import * as motion from "motion/react-client"
import { cubicBezier } from "motion/react";
import Link from "next/link";
import { useI18n } from "@/lib/use-i18n";



export default function Login() {
  const { tx } = useI18n();
  return (
    <section id="hero" className="py-10 px-4 sm:px-6 lg:px-8 min-h-screen flex justify-center items-center">
      <div className="max-w-7xl mx-auto my-auto w-full">
        <div className="flex md:flex-row flex-col gap-4">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: cubicBezier(0.4, 0, 0.2, 1) }}
            className="bg-white dark:bg-neutral-950 p-6 md:p-12 rounded-4xl w-full max-w-xl mx-auto dark:border border-border flex flex-col">

              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-2">
                {tx("login.signIn")}
              </h1>

              <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                {tx("login.continueMessage")}
              </p>

              {/* Social Login Buttons */}
              <div className="flex md:flex-row flex-col items-center justify-center gap-4">
                <Link href="/" className="w-full px-6 py-3 cursor-pointer bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-3">
                  <Image src="/img/google.svg" className="w-5 h-5 dark:invert" alt="Google" width={20} height={20} />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">{tx("login.continueGoogle")}</span>
                </Link>
                <Link href="/" className="w-full px-6 py-3 cursor-pointer bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-3">
                  <Image src="/img/apple.svg" className="w-5 h-5 dark:invert" alt="Apple" width={20} height={20} />
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">{tx("login.continueApple")}</span>
                </Link>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
                <span className="text-sm text-zinc-500 dark:text-zinc-500">{tx("login.or")}</span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
              </div>

              {/* Signup Form */}
              <form className="space-y-4">
              

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                    {tx("login.emailAddress")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-highlight focus:border-transparent outline-none transition-all text-zinc-900 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                    {tx("login.password")}
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-highlight focus:border-transparent outline-none transition-all text-zinc-900 dark:text-white"
                    placeholder="********"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-highlight focus:ring-highlight"
                  />
                  <label htmlFor="terms" className="text-sm text-zinc-600 dark:text-zinc-400">
                    {tx("login.agreeTo")}{" "}
                    <Link href="/terms" className="text-zinc-900 dark:text-white hover:text-highlight underline">
                      {tx("login.terms")}
                    </Link>{" "}
                    {tx("login.and")}{" "}
                    <Link href="/privacy-policy" className="text-zinc-900 dark:text-white hover:text-highlight underline">
                      {tx("login.privacy")}
                    </Link>
                  </label>
                </div>

                <Link href="/"
                  type="submit"
                  className="w-full flex items-center text-white dark:text-black justify-center cursor-pointer px-6 py-3 text-black bg-black dark:bg-white hover:bg-highlight-hover text-highlight-text rounded-xl font-semibold transition-colors"
                >
                  {tx("login.signIn")}
                </Link>
              </form>

              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-6">
                {tx("login.needAccess")}
              </p>
          </motion.div>
        </div>
       
      </div>
    </section>
  );
}

