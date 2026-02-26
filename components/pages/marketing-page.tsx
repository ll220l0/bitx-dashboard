"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, SearchIcon, EditIcon, BellIcon, CalendarIcon, UsersIcon, PlayIcon, SmartphoneIcon, TargetIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useI18n } from "@/lib/use-i18n";

interface Campaign {
  id: number;
  name: string;
  type: "push-notification" | "in-app" | "acquisition" | "retargeting";
  frequency?: "daily" | "weekly" | "bi-weekly" | "monthly";
  status: "active" | "paused" | "draft";
  targetUsers: number;
  lastSent?: string;
  nextSend?: string;
  conversionRate?: number;
  engagementRate?: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Daily App Engagement Boost",
    type: "push-notification",
    frequency: "daily",
    status: "active",
    targetUsers: 450000,
    lastSent: "2024-01-22",
    nextSend: "2024-01-23",
    conversionRate: 12.5,
    engagementRate: 28.3,
  },
  {
    id: 2,
    name: "New Feature Spotlight - AI Assistant",
    type: "in-app",
    frequency: "weekly",
    status: "active",
    targetUsers: 320000,
    lastSent: "2024-01-20",
    nextSend: "2024-01-27",
    conversionRate: 18.7,
    engagementRate: 42.1,
  },
  {
    id: 3,
    name: "Q1 User Acquisition - iOS",
    type: "acquisition",
    status: "active",
    targetUsers: 1200000,
    lastSent: "2024-01-15",
    conversionRate: 5.2,
    engagementRate: 15.8,
  },
  {
    id: 4,
    name: "Abandoned Cart Recovery",
    type: "push-notification",
    frequency: "daily",
    status: "active",
    targetUsers: 85000,
    lastSent: "2024-01-22",
    nextSend: "2024-01-23",
    conversionRate: 24.3,
    engagementRate: 38.7,
  },
  {
    id: 5,
    name: "Premium Upgrade Promotion",
    type: "in-app",
    status: "draft",
    targetUsers: 0,
  },
  {
    id: 6,
    name: "Inactive User Re-engagement",
    type: "retargeting",
    frequency: "weekly",
    status: "paused",
    targetUsers: 250000,
    lastSent: "2024-01-08",
    nextSend: "2024-01-29",
    conversionRate: 8.9,
    engagementRate: 22.4,
  },
  {
    id: 7,
    name: "Weekly Tips & Tricks",
    type: "push-notification",
    frequency: "weekly",
    status: "active",
    targetUsers: 580000,
    lastSent: "2024-01-21",
    nextSend: "2024-01-28",
    conversionRate: 15.2,
    engagementRate: 35.6,
  },
  {
    id: 8,
    name: "Summer Sale Campaign 2024",
    type: "acquisition",
    status: "draft",
    targetUsers: 0,
  },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
    paused: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
    draft: "bg-neutral-500/20 text-neutral-700 dark:text-neutral-400 border-neutral-500/30",
  };
  return colors[status] || "bg-neutral-500/20 text-neutral-700 dark:text-neutral-400 border-neutral-500/30";
};

export default function Marketing() {
  const {
    tx,
    formatDate,
    countLabel,
    campaignTypeLabel,
    campaignFrequencyLabel,
    campaignStatusLabel,
  } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = mockCampaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign.frequency && campaign.frequency.toLowerCase().includes(searchQuery.toLowerCase())) ||
      campaign.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className='w-full sticky top-0 z-50 bg-white dark:bg-neutral-950 flex-shrink-0 flex flex-row h-16 items-center px-8 border-b border-neutral-200 dark:border-neutral-800'>
        <h1 className='text-lg font-bold'>{tx("marketing.title")}</h1>
        <div className="ml-4 flex gap-2">
          <Badge variant="outline" className="text-xs">
            {countLabel("campaigns", mockCampaigns.length)}
          </Badge>
         
        </div>
        <div className="ml-auto flex gap-2">
          <Button size="sm">
            <PlusIcon className="w-4 h-4 mr-2" />
            {tx("common.new")}
          </Button>
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto flex-1 p-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={tx("marketing.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {tx("marketing.showing", { shown: filteredCampaigns.length, total: mockCampaigns.length })}
          </p>
        </div>

        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden md:block rounded-lg w-full border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900">
                <TableHead>{tx("marketing.campaignName")}</TableHead>
                <TableHead>{tx("marketing.type")}</TableHead>
                <TableHead>{tx("marketing.frequency")}</TableHead>
                <TableHead>{tx("marketing.status")}</TableHead>
                <TableHead className="text-right">{tx("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    {tx("marketing.noResults")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm mb-1">{campaign.name}</p>
                        <div className="flex items-center gap-1 text-xs">
                          {campaign.frequency && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {tx("marketing.recurring")}
                            </p>
                          )}
                          {campaign.nextSend ? (
                            <div className="flex items-center gap-1.5 ml-4 text-muted-foreground">
                              {tx("marketing.next")}: {formatDate(campaign.nextSend, { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                          ) : (
                            <span className="text-muted-foreground"></span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                        {campaign.type === "push-notification" && <BellIcon className="w-3 h-3" />}
                        {campaign.type === "in-app" && <SmartphoneIcon className="w-3 h-3" />}
                        {campaign.type === "acquisition" && <UsersIcon className="w-3 h-3" />}
                        {campaign.type === "retargeting" && <TargetIcon className="w-3 h-3" />}
                        {campaignTypeLabel(campaign.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {campaign.frequency ? (
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                          {campaignFrequencyLabel(campaign.frequency)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaignStatusLabel(campaign.status)}
                      </Badge>
                    </TableCell>



                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label="Edit campaign"
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tx("users.edit")}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label="Launch campaign"
                              disabled={campaign.status === "draft"}
                            >
                              <PlayIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tx("marketing.launch")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards - Hidden on Desktop */}
        <div className="md:hidden space-y-2">
          {filteredCampaigns.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground border-none">
              {tx("marketing.noResults")}
            </Card>
          ) : (
            filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="p-4 border-none">
                <div className="space-y-3">
                  {/* Campaign Name and Type */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm mb-1">{campaign.name}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                          {campaign.type === "push-notification" && <BellIcon className="w-3 h-3" />}
                          {campaign.type === "in-app" && <SmartphoneIcon className="w-3 h-3" />}
                          {campaign.type === "acquisition" && <UsersIcon className="w-3 h-3" />}
                          {campaign.type === "retargeting" && <TargetIcon className="w-3 h-3" />}
                          {campaignTypeLabel(campaign.type)}
                        </Badge>
                        {campaign.frequency && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {campaignFrequencyLabel(campaign.frequency)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(campaign.status)} flex-shrink-0`}>
                      {campaignStatusLabel(campaign.status)}
                    </Badge>
                  </div>

                  {/* Next Send Date */}
                  {campaign.nextSend && (
                    <p className="text-xs text-muted-foreground">
                      {tx("marketing.next")}: {formatDate(campaign.nextSend, { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      aria-label="Edit campaign"
                    >
                      <EditIcon className="h-4 w-4 mr-1" />
                      {tx("users.edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      aria-label="Launch campaign"
                      disabled={campaign.status === "draft"}
                    >
                      <PlayIcon className="h-4 w-4 mr-1" />
                      {tx("marketing.launch")}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

    </>
  );
}

