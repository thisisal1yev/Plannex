import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  CalendarDays,
  Clock,
  TrendingUp,
  DollarSign,
  Filter,
} from "lucide-react";
import { analyticsApi } from "@entities/analytics/api/analyticsApi";
import type { AdminPendingEvent } from "@entities/analytics/model/types";
import { Badge } from "@shared/ui/Badge";
import type { BadgeColor } from "@shared/ui/Badge";
import { Input } from "@shared/ui/Input";
import { Spinner } from "@shared/ui/Spinner";
import { Table } from "@shared/ui/Table";
import type { TableColumn } from "@shared/ui/Table";
import { analyticsKeys } from "@shared/api/queryKeys";
import { formatDateDefault, formatUZS } from "@shared/lib/dateUtils";

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">
          {title}
        </span>
        <div className="bg-primary/10 text-primary rounded-lg p-2">
          <Icon className="size-4" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
        {trend && (
          <span
            className={`text-xs font-medium ${trendUp ? "text-green-600" : "text-red-500"}`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function GrowthChart({ data }: { data: { week: string; users: number }[] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Platform Growth
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0.25}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#colorUsers)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function RevenueChart({
  data,
}: {
  data: { month: string; revenue: number }[];
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Total Revenue
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip
            formatter={(value) => {
              const numeric =
                typeof value === "number"
                  ? value
                  : typeof value === "string"
                  ? Number(value)
                  : Array.isArray(value)
                  ? Number(value[0])
                  : 0;

              return [formatUZS(numeric), "Revenue"];
            }}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const STATUS_BADGE: Record<string, { label: string; color: BadgeColor }> = {
  DRAFT: { label: "Pending Review", color: "yellow" },
  PUBLISHED: { label: "Published", color: "green" },
  CANCELLED: { label: "Cancelled", color: "red" },
};

export function AdminDashboardPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: analyticsKeys.adminDashboard(),
    queryFn: analyticsApi.adminDashboard,
  });

  const filtered = (data?.recentPendingEvents ?? []).filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      `${e.organizer.firstName} ${e.organizer.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const columns: TableColumn<AdminPendingEvent>[] = [
    {
      header: "Event",
      className: "px-4 py-3 font-medium text-foreground",
      render: (e) => (
        <div className="flex items-center gap-3">
          {e.bannerUrl ? (
            <img
              src={e.bannerUrl}
              alt=""
              className="w-8 h-8 rounded object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
              <CalendarDays className="size-4 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-foreground text-sm">
              {e.title}
            </span>
            <span className="text-xs text-muted-foreground">{e.eventType}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Organizer",
      render: (e) => `${e.organizer.firstName} ${e.organizer.lastName}`,
    },
    {
      header: "Date",
      render: (e) => formatDateDefault(e.startDate),
    },
    {
      header: "Status",
      render: (e) => {
        const s = STATUS_BADGE[e.status] ?? {
          label: e.status,
          color: "gray" as BadgeColor,
        };
        return <Badge color={s.color}>{s.label}</Badge>;
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatUZS(data?.totalRevenue ?? 0)}
          icon={DollarSign}
          sub="All time payments"
        />
        <StatCard
          title="Active Users"
          value={data?.totalUsers ?? 0}
          icon={Users}
          sub="Registered accounts"
        />
        <StatCard
          title="Pending Events"
          value={data?.pendingEvents ?? 0}
          icon={Clock}
          sub="Awaiting review"
          trend={
            data && data.pendingEvents > 0
              ? `${data.pendingEvents} need action`
              : undefined
          }
          trendUp={false}
        />
        <StatCard
          title="Total Events"
          value={data?.totalEvents ?? 0}
          icon={TrendingUp}
          sub="All time events"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GrowthChart data={data?.weeklyGrowth ?? []} />
        <RevenueChart data={data?.monthlyRevenue ?? []} />
      </div>

      {/* Recent pending events table */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Recent Event Submissions
          </h2>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted/50 transition-colors">
            <Filter className="size-3.5" />
            Filter
          </button>
        </div>
        <Input
          placeholder="Search events or organizers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Table<AdminPendingEvent>
          columns={columns}
          data={filtered}
          keyExtractor={(e) => e.id}
          emptyMessage="No pending events found"
        />
      </div>
    </div>
  );
}
