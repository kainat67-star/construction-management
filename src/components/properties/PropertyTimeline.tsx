import { TimelineEvent } from "@/data/properties";
import { Calendar, FileText, Home, Hammer, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyTimelineProps {
  events: TimelineEvent[];
}

const getEventIcon = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "Property Created":
      return <Home className="h-4 w-4" />;
    case "Construction Started":
      return <Hammer className="h-4 w-4" />;
    case "Property Rented":
      return <DollarSign className="h-4 w-4" />;
    case "Property Sold":
      return <CheckCircle className="h-4 w-4" />;
    case "Document Uploaded":
      return <FileText className="h-4 w-4" />;
    case "Note Added":
      return <AlertCircle className="h-4 w-4" />;
    case "Status Changed":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const getEventColor = (type: TimelineEvent["type"]) => {
  switch (type) {
    case "Property Created":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    case "Construction Started":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "Property Rented":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "Property Sold":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    case "Document Uploaded":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    case "Note Added":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    case "Status Changed":
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  }
};

export function PropertyTimeline({ events }: PropertyTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  // Sort events by date (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedEvents.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Property Timeline</h3>
        <div className="p-8 border-2 border-dashed rounded-lg bg-muted/50 text-center">
          <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No timeline events available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Property Timeline / Activity History</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Timeline dot */}
              <div className={cn(
                "relative z-10 flex items-center justify-center w-7 h-7 rounded border border-background bg-card",
                "text-muted-foreground"
              )}>
                {getEventIcon(event.type)}
              </div>

              {/* Event content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "inline-flex rounded border px-2 py-0.5 text-xs font-medium",
                        getEventColor(event.type)
                      )}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{event.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground">
                      {formatDate(event.date)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(event.date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

