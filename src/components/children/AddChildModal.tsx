"use client";

import React, { useState } from "react";
import { addChildAction } from "@/app/actions/children";
import { Child } from "@/types/database.types";
import { useLedger } from "@/context/LedgerContext";

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChildAdded: (child: Child) => void;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({
  isOpen,
  onClose,
  onChildAdded,
}) => {
  const { addChild } = useLedger();

  // Clean empty inputs with smart placeholders
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ageDisplay, setAgeDisplay] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [medicalAidNumber, setMedicalAidNumber] = useState("");
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !ageDisplay.trim()) {
      setErrorMsg("Please provide child's name and age/grade.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Add to reactive LedgerContext (persists to localRepository & dispatches event)
      const newChild = await addChild({
        user_id: "user-mother-01",
        first_name: firstName.trim(),
        last_name: lastName.trim() || null,
        date_of_birth: null,
        age_display: ageDisplay.trim(),
        school_name: schoolName.trim() || null,
        medical_aid_number: medicalAidNumber.trim() || null,
        avatar_url: null,
        default_split_ratio: splitRatio,
        notes: notes.trim() || null,
      });

      // 2. Also call server action for server-side revalidation
      await addChildAction({
        first_name: firstName.trim(),
        last_name: lastName.trim() || null,
        age_display: ageDisplay.trim(),
        school_name: schoolName.trim() || null,
        medical_aid_number: medicalAidNumber.trim() || null,
        default_split_ratio: splitRatio,
        notes: notes.trim() || null,
      });

      setLoading(false);
      onChildAdded(newChild);
      onClose();
    } catch (err: unknown) {
      setLoading(false);
      setErrorMsg(err instanceof Error ? err.message : "Failed to add beneficiary");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/40 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">child_care</span>
            </div>
            <h3 className="font-headline text-base font-bold text-on-surface">
              Add New Child Beneficiary
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-error-container text-on-error-container text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Liam"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Jenkins"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                Age / Grade *
              </label>
              <input
                type="text"
                required
                value={ageDisplay}
                onChange={(e) => setAgeDisplay(e.target.value)}
                placeholder="e.g. Age 5 • Grade R"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
                Medical Aid No.
              </label>
              <input
                type="text"
                value={medicalAidNumber}
                onChange={(e) => setMedicalAidNumber(e.target.value)}
                placeholder="e.g. MED-88192-03"
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
              School or Nursery Name
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Crawford College / Pre-Primary"
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-primary"
            />
          </div>

          {/* Court Split Ratio */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
              Court Default Co-Parent Split Ratio ({splitRatio}%)
            </label>
            <div className="flex items-center gap-1.5">
              {[50, 60, 70, 100].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setSplitRatio(ratio)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    splitRatio === ratio
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-container text-on-surface-variant border-outline-variant/30"
                  }`}
                >
                  {ratio}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-on-surface-variant uppercase">
              Notes (Allergies, Extra-murals)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Asthma prescription, swimming lessons"
              className="w-full p-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add to Registry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
