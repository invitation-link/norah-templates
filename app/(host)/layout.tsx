"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut, Megaphone, Plus, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/components/providers/AuthProvider";
import { LoginModal } from "@/app/components/ui/LoginModal";
import styles from "./ProductShell.module.css";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Invite Link home">
          <Image src="/brand/invite-link-mark.png" alt="" width={510} height={445} priority />
          <span>invite <strong>Link</strong></span>
        </Link>
        <nav aria-label="Product navigation">
          <Link href="/create" className={pathname === "/create" || pathname.startsWith("/editor") ? styles.active : ""}>
            <Plus size={17} aria-hidden="true" /> Create
          </Link>
          <Link href="/dashboard" className={pathname === "/dashboard" ? styles.active : ""}>
            <LayoutGrid size={17} aria-hidden="true" /> My invitations
          </Link>
          <Link href="/growth" className={pathname === "/growth" ? styles.active : ""}>
            <Megaphone size={17} aria-hidden="true" /> Growth
          </Link>
        </nav>
        <div className={styles.account}>
          {loading ? <span className={styles.accountSkeleton} /> : user ? (
            <button type="button" onClick={() => signOut()} aria-label="Sign out">
              <LogOut size={18} aria-hidden="true" /> <span>Sign out</span>
            </button>
          ) : (
            <button type="button" onClick={() => setShowLogin(true)}>
              <UserRound size={18} aria-hidden="true" /> <span>Sign in</span>
            </button>
          )}
        </div>
      </header>
      <main className={styles.workspace}>{children}</main>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} redirectTo={pathname} />
    </div>
  );
}
