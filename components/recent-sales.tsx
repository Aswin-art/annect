import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPrice } from "@/lib/format";
import { events, users } from "@prisma/client";

type TransactionType = {
  created_at: Date;
  events: events;
  users: users;
  status: boolean;
};

export function RecentSales({ data }: { data: TransactionType[] }) {
  return (
    <div className="space-y-8">
      {data.map((item, index: number) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.users.image ?? ""} alt="Avatar" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {item.users.name}
            </p>
            <p className="text-sm text-muted-foreground">{item.users.email}</p>
          </div>
          <div className="ml-auto font-medium">
            {formatPrice(item.events.price)}
          </div>
        </div>
      ))}
    </div>
  );
}
