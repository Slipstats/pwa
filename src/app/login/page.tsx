"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction, signupAction } from "@/app/actions/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"mother" | "co_parent" | "legal_counsel">("mother");
  const [courtCaseNumber, setCourtCaseNumber] = useState("");
  const [courtJurisdiction, setCourtJurisdiction] = useState("");

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    setEmail("sarah.jenkins@example.com");
    setPassword("demo123456");

    const formData = new FormData();
    formData.append("email", "sarah.jenkins@example.com");
    formData.append("password", "demo123456");

    const res = await loginAction(formData);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Logged in as Sarah Jenkins (Demo)");
      await refreshAuth();
      setTimeout(() => router.push("/dashboard"), 500);
    } else {
      setErrorMsg(res.error || "Demo login failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    if (tab === "register") {
      formData.append("fullName", fullName);
      formData.append("role", role);
      formData.append("courtCaseNumber", courtCaseNumber);
      formData.append("courtJurisdiction", courtJurisdiction);

      const res = await signupAction(formData);
      setLoading(false);

      if (res.success) {
        setSuccessMsg("Account created successfully! Redirecting...");
        await refreshAuth();
        setTimeout(() => router.push("/dashboard"), 800);
      } else {
        setErrorMsg(res.error || "Registration failed");
      }
    } else {
      const res = await loginAction(formData);
      setLoading(false);

      if (res.success) {
        setSuccessMsg("Welcome back! Redirecting...");
        await refreshAuth();
        setTimeout(() => router.push("/dashboard"), 600);
      } else {
        setErrorMsg(res.error || "Sign in failed");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[82vh] w-full max-w-md mx-auto py-6">
      {/* Brand Identity Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center shadow-md mb-3 border border-primary-fixed-dim/50">
          <Image
            src="/images/logo.png"
            alt="Slipstats Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="font-headline text-headline-md font-bold text-primary tracking-tight">
          Slipstats
        </h1>
        <p className="font-body text-body-sm text-on-surface-variant max-w-xs mt-1">
          Court-Ready Child Expense Tracker & Cryptographic Till Ledger for Mothers
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full rounded-2xl bg-surface-container-lowest p-space-md md:p-6 border border-outline-variant/40 shadow-lg flex flex-col gap-space-md">
        {/* Tab Switcher: Login vs Register */}
        <div className="w-full bg-surface-container-high p-1 rounded-xl flex items-center shadow-inner">
          <button
            type="button"
            id="tab-login-btn"
            onClick={() => {
              setTab("login");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === "login"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            id="tab-register-btn"
            onClick={() => {
              setTab("register");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === "register"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-medium flex items-center gap-2 border border-error/20 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold flex items-center gap-2 border border-secondary/30 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Demo Login Banner */}
        {tab === "login" && (
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full p-2.5 rounded-xl bg-secondary-fixed/40 hover:bg-secondary-fixed/70 border border-secondary-fixed-dim/60 text-on-secondary-fixed-variant text-xs font-semibold flex items-center justify-between transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-secondary group-hover:scale-110 transition-transform">
                bolt
              </span>
              <span>1-Click Test: Continue as Sarah Jenkins (Mother)</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-secondary">
              arrow_forward
            </span>
          </button>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {tab === "register" && (
            <>
              <div className="flex flex-col gap-1">
                <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  id="reg-fullname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              {/* Role Selection */}
              <div className="flex flex-col gap-1">
                <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Your Role
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "mother", label: "Mother / Primary" },
                    { id: "co_parent", label: "Co-Parent" },
                    { id: "legal_counsel", label: "Attorney" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all truncate ${
                        role === r.id
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-surface-container-low text-on-surface-variant border-outline-variant/30"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                    Court Case No.
                  </label>
                  <input
                    type="text"
                    id="reg-case"
                    value={courtCaseNumber}
                    onChange={(e) => setCourtCaseNumber(e.target.value)}
                    placeholder="e.g. MC-2024/7821"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                    Court Jurisdiction
                  </label>
                  <input
                    type="text"
                    id="reg-jurisdiction"
                    value={courtJurisdiction}
                    onChange={(e) => setCourtJurisdiction(e.target.value)}
                    placeholder="e.g. Randburg Court"
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-primary"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              id="auth-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mother@family.com"
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              id="auth-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            {tab === "register" && (
              <span className="font-body text-[10px] text-on-surface-variant">
                Must be at least 6 characters.
              </span>
            )}
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="w-full h-12 mt-2 bg-primary text-white rounded-xl font-label text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                <span>{tab === "login" ? "Signing In..." : "Creating Account..."}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  {tab === "login" ? "login" : "person_add"}
                </span>
                <span>{tab === "login" ? "Sign In to Ledger" : "Create Court Profile"}</span>
              </>
            )}
          </button>
        </form>

        {/* Legal Disclaimer */}
        <div className="pt-2 border-t border-outline-variant/20 text-center">
          <p className="font-body text-[11px] text-on-surface-variant leading-relaxed">
            Encrypted with SHA-256 integrity hashing under South African Maintenance Act 99 of 1998
            Form 4A evidentiary standards.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href="/dashboard"
          className="text-xs text-on-surface-variant hover:text-primary font-medium flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
