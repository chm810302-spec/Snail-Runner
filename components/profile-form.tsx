"use client";

import { useState, useEffect } from "react";
import { useFirebase } from "./firebase-provider";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { handleFirestoreError, OperationType } from "@/lib/firebase-error";
import { Loader2, Save, CheckCircle2 } from "lucide-react";

export function ProfileForm() {
  const { user, profile, loading } = useFirebase();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Not Signed In</h2>
        <p className="text-slate-600">Please sign in to view and edit your profile.</p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName,
        bio,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`, auth);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={user.email || ""}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-slate-500">Your email cannot be changed.</p>
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How should we call you?"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">
            Running Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your running journey, goals, or favorite routes..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
            maxLength={500}
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-slate-500">Share a bit about yourself.</p>
            <p className="text-xs text-slate-400">{bio.length}/500</p>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Save Profile
          </button>
          
          {saveSuccess && (
            <div className="flex items-center gap-2 text-green-600 font-medium animate-in fade-in slide-in-from-left-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Saved successfully!</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
