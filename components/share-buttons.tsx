"use client";

import { MessageCircle, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "X", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow mr-1">Share</span>
      {links.map((link) => (
        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${link.label}`}
          className="flex h-9 w-9 items-center justify-center border border-ink-300 text-ink-600 hover:border-signal hover:text-signal-dim dark:border-ink-700 dark:text-ink-300">
          <link.icon className="h-4 w-4" />
        </a>
      ))}
      <button type="button" onClick={copyLink} aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center border border-ink-300 text-ink-600 hover:border-signal hover:text-signal-dim dark:border-ink-700 dark:text-ink-300">
        <LinkIcon className="h-4 w-4" />
      </button>
      {copied && <span className="text-xs text-go">Copied!</span>}
    </div>
  );
}