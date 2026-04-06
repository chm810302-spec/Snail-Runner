"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, setDoc, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useFirebase } from "./firebase-provider";
import { MessageCircle, Send, Trash2, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { handleFirestoreError, OperationType } from "@/lib/firestore-error";

interface Comment {
  id: string;
  postId: string;
  authorUid: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  createdAt: any;
}

export function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile, signInWithGoogle } = useFirebase();

  useEffect(() => {
    if (!db) return;

    const path = `posts/${postId}/comments`;
    const q = query(
      collection(db, path),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData: Comment[] = [];
      snapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(commentsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !db) return;

    setIsSubmitting(true);
    const path = `posts/${postId}/comments`;
    try {
      const commentRef = collection(db, path);
      const newDocRef = doc(commentRef);
      
      await setDoc(newDocRef, {
        id: newDocRef.id,
        postId,
        authorUid: user.uid,
        authorName: profile?.displayName || user.email?.split("@")[0] || "Anonymous Runner",
        authorPhoto: profile?.photoURL || "",
        content: newComment.trim(),
        createdAt: serverTimestamp(),
      });
      
      setNewComment("");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user || !db) return;
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const path = `posts/${postId}/comments/${commentId}`;
    try {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <section className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="h-6 w-6 text-orange-500" />
        <h3 className="text-2xl font-bold text-slate-900">Comments ({comments.length})</h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {profile?.photoURL ? (
                <Image
                  src={profile.photoURL}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none min-h-[100px] transition-all"
                required
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center mb-12">
          <p className="text-slate-600 mb-4">Join the conversation with other runners.</p>
          <button
            onClick={signInWithGoogle}
            className="bg-white border border-slate-200 hover:border-orange-500 text-slate-700 px-6 py-2.5 rounded-full font-medium transition-all inline-flex items-center gap-2"
          >
            <UserIcon className="h-4 w-4" />
            Sign in to comment
          </button>
        </div>
      )}

      <div className="space-y-6">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex-shrink-0">
                {comment.authorPhoto ? (
                  <Image
                    src={comment.authorPhoto}
                    alt={comment.authorName}
                    width={40}
                    height={40}
                    className="rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{comment.authorName}</span>
                    <span className="text-sm text-slate-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  {user && user.uid === comment.authorUid && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {comments.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </section>
  );
}
