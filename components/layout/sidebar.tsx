"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HomeIcon,
    SettingsIcon,
    UsersIcon,
    ChevronLeftIcon,
    TrendingUpIcon,
    MailIcon,
    ShoppingCartIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../ui/theme-toggle";
import Image from "next/image";
import { DynamicIcon } from "lucide-react/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Spotlight } from "../Spotlight";
import { useI18n } from "@/lib/use-i18n";

interface SidebarProps {
    className?: string;
    defaultCollapsed?: boolean;
}

interface NavItem {
    labelKey: string;
    icon: React.ElementType;
    href?: string;
    badge?: number;
}

const navItems: NavItem[] = [
    { labelKey: "nav.dashboard", icon: HomeIcon, href: "/" },
    { labelKey: "nav.products", icon: ShoppingCartIcon, href: "/products" },
    { labelKey: "nav.users", icon: UsersIcon, href: "/users", badge: 3 },
    { labelKey: "nav.marketing", icon: MailIcon, href: "/marketing" },
    { labelKey: "nav.analytics", icon: TrendingUpIcon, href: "/analytics" },
    { labelKey: "nav.settings", icon: SettingsIcon, href: "/settings" },
];

export function Sidebar({ className, defaultCollapsed = false }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
    const { tx } = useI18n();
    return (
        <>
            {isSpotlightOpen && (
                <Spotlight onClose={() => setIsSpotlightOpen(false)} />
            )}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden fixed z-[999] right-2 bottom-2 size-14 bg-black dark:bg-white rounded-full"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <DynamicIcon name={isMobileMenuOpen ? "x" : "menu"} className="size-5 text-white dark:text-black" />
            </Button>
            <TooltipProvider delayDuration={0}>
                {/* Mobile Backdrop */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 bg-black/50 z-[100] md:hidden"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            {/* Mobile Sidebar */}
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed right-0 top-0 h-full w-full bg-background shadow-xl z-[101] md:hidden"
                            >
                                <div className="flex h-full flex-col">
                                    {/* Header */}
                                    <div className="flex h-16 relative items-center justify-start px-4 border-b border-border">
                                        <div className="flex flex-row items-center gap-2 flex-1">
                                            <Image
                                                src="/img/bitx-logo.svg"
                                                alt="BitX"
                                                width={120}
                                                height={56}
                                                className="h-7 w-auto ml-2"
                                                priority
                                            />
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
                                        {navItems.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = pathname === item.href;
                                            const itemLabel = tx(item.labelKey);

                                            return (
                                                <Link href={item.href || "#"} key={item.labelKey}>
                                                    <Button
                                                        variant={isActive ? "ghost" : "ghost"}
                                                        className={`w-full justify-start relative mb-1.5 cursor-pointer rounded-full px-3 ${isActive ? 'dark:bg-card' : ''}`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <Icon className="h-5 w-5 mr-3" />
                                                        <span>{itemLabel}</span>
                                                        {item.badge && (
                                                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-primary-foreground text-xs">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </Button>
                                                </Link>
                                            );
                                        })}
                                    </nav>

                                    {/* Footer - User Profile */}
                                    <div className="mb-6 px-4">
                                        <ThemeToggle />
                                    </div>
                                    <div className="border-t p-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary p-2 rounded-lg">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                                                        JD
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-sm font-medium truncate">John Doe</p>
                                                        <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                                                    </div>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="w-56">
                                                <DropdownMenuItem asChild>
                                                    <Link href="/settings" className="cursor-pointer">
                                                        <DynamicIcon name="settings" className="size-4" />
                                                        <span>{tx("nav.settings")}</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/login" className="cursor-pointer">
                                                        <DynamicIcon name="log-out" className="size-4" />
                                                        <span>{tx("nav.logout")}</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Desktop Sidebar - Always visible */}
                <div
                    className={cn(
                        "hidden md:block sticky top-0 h-screen border-r border-border bg-background transition-all duration-300 ease-in-out z-50",
                        isCollapsed ? "w-16" : "w-64",
                        className
                    )}
                >
                    <div className="flex h-full flex-col">
                        {/* Header */}
                        <div className="flex h-16 relative items-center justify-start px-4 border-b border-border">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`hidden md:flex items-center justify-center absolute top-5 cursor-pointer h-6 w-6 rounded-full border border-border bg-background shadow-md hover:bg-accent ${isCollapsed ? '-right-3 !hidden' : 'right-3'}`}
                                onClick={() => setIsCollapsed(!isCollapsed)}
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                            </Button>

                            {!isCollapsed && (
                                <Image
                                    src="/img/bitx-logo.svg"
                                    alt="BitX"
                                    width={120}
                                    height={56}
                                    className="h-7 w-auto ml-2"
                                    priority
                                />
                            )}

                            {isCollapsed && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`cursor-pointer size-8 rounded-lg bg-background shadow-md hover:bg-accent ${isCollapsed ? '-right-3' : 'right-3'}`}
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                >
                                    <DynamicIcon name="sidebar" />
                                </Button>
                            )}
                        </div>

                        <div className="p-3">
                            <div onClick={() => setIsSpotlightOpen(true)} className="flex flex-nowrap transition-all duration-300 ease-in-out cursor-pointer hover:bg-card flex-row items-center p-2 border border-border rounded-lg">
                                <DynamicIcon name="search" className="size-3 ml-1 text-muted-foreground flex-shrink-0" />
                              
                                        <span className={`text-xs transition-all duration-300 overflow-hidden ease-in-out text-nowrap whitespace-nowrap ml-4 text-muted-foreground ${isCollapsed ? 'w-0' : 'block'}`}>{tx("nav.search")}</span>
                                        <span className={` transition-all duration-300 overflow-hidden ease-in-out text-nowrap rounded-sm ml-auto  bg-card text-[9px] bg-card ${isCollapsed ? 'w-0' : 'block py-1 px-2'}`}>
                                            Ctrl K
                                        </span>
                            </div>
                        </div>
                        {/* Navigation */}
                        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                const itemLabel = tx(item.labelKey);

                                const button = (
                                    <Link href={item.href || "#"} key={item.labelKey}>
                                        <Button
                                            variant={isActive ? "secondary" : "ghost"}
                                            className={cn(
                                                "w-full justify-start relative mb-1.5 cursor-pointer rounded-lg",
                                                isCollapsed ? "px-0 justify-center" : "px-3",
                                                isActive ? "dark:bg-card" : ""
                                            )}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                                            {!isCollapsed && <span>{itemLabel}</span>}
                                            {!isCollapsed && item.badge && (
                                                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-primary-foreground text-xs">
                                                    {item.badge}
                                                </span>
                                            )}
                                            {isCollapsed && item.badge && (
                                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Button>
                                    </Link>
                                );

                                if (isCollapsed) {
                                    return (
                                        <Tooltip key={item.labelKey}>
                                            <TooltipTrigger asChild>{button}</TooltipTrigger>
                                            <TooltipContent side="right" className="flex items-center gap-2">
                                                {itemLabel}
                                                {item.badge && (
                                                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-primary-foreground text-xs">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                }

                                return button;
                            })}
                        </nav>

                        {/* Footer - User Profile */}

                        <div className="mb-6 px-4">
                            <ThemeToggle />
                        </div>
                        <div className="border-t p-4">
                            {!isCollapsed ? (

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary p-2 rounded-lg">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                                                JD
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-medium truncate">John Doe</p>
                                                <p className="text-xs text-muted-foreground truncate">john@example.com</p>
                                            </div>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-56">
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings" className="cursor-pointer">
                                                <DynamicIcon name="settings" className="size-4" />
                                                <span>{tx("nav.settings")}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/login" className="cursor-pointer">
                                                <DynamicIcon name="log-out" className="size-4" />
                                                <span>{tx("nav.logout")}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold mx-auto cursor-pointer">
                                            JD
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <div>
                                            <p className="text-sm font-medium">John Doe</p>
                                            <p className="text-xs text-muted-foreground">john@example.com</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>


                    </div>
                </div>
            </TooltipProvider>
        </>
    );
}


