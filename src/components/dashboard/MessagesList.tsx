import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  message: string;
  time: string;
  unread?: number;
  avatar?: string;
}

const messages: Message[] = [
  {
    id: "1",
    name: "Jane Cooper",
    message: "I need a Property",
    time: "12 Min ago",
    unread: 12,
  },
  {
    id: "2",
    name: "Alina Hossan",
    message: "My Budget is $500.000",
    time: "15 Min ago",
    unread: 2,
  },
  {
    id: "3",
    name: "Maria Smth",
    message: "Thank you so much",
    time: "20 Min ago",
  },
  {
    id: "4",
    name: "John Doe",
    message: "Can we schedule a viewing?",
    time: "25 Min ago",
    unread: 5,
  },
  {
    id: "5",
    name: "Sarah Wilson",
    message: "I'm interested in the property",
    time: "30 Min ago",
  },
];

export function MessagesList() {
  return (
    <Card className="border-border shadow-card">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
        <CardTitle className="text-base sm:text-lg font-bold">Messages</CardTitle>
        <Select defaultValue="today">
          <SelectTrigger className="w-full sm:w-[100px] h-8 text-xs">
            <SelectValue placeholder="Today" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex-shrink-0 items-center justify-center flex">
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                {message.name.charAt(0)}
              </span>
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-foreground text-xs sm:text-sm truncate">{message.name}</h4>
                {message.unread && (
                  <span className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] sm:text-xs font-bold flex items-center justify-center flex-shrink-0 ml-2">
                    {message.unread}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{message.message}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{message.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
