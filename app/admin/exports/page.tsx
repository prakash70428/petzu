import { Download } from "lucide-react";
import { PageHeader } from "@/features/dashboard/components";

const exportsList = [
  { key: "bookings", title: "Booking requests", description: "Every vet, groomer, trainer and sitter booking request with its status." },
  { key: "enquiries", title: "Enquiries, partner requests, feedback and complaints", description: "Everything from the contact and partner forms and the feedback page." },
  { key: "customers", title: "Customers", description: "Everyone who has chatted, asked, enquired, booked or subscribed." },
  { key: "community", title: "Community questions", description: "Questions with the asker's email and number of answers." },
  { key: "community_answers", title: "Community answers", description: "Answers with the question they belong to." },
  { key: "chats", title: "Chat conversations", description: "Every message between customers and the assistant." },
  { key: "newsletter", title: "Newsletter subscribers", description: "Emails that opted in to marketing, with where they signed up." },
  { key: "consents", title: "All message consents", description: "Email, SMS and WhatsApp opt-ins and opt-outs per customer." },
  { key: "messages_sent", title: "Messages sent", description: "Every email, SMS and WhatsApp message the system tried to send, and the result." },
];

/** One-click downloads of the business's data (proposal: data ownership and portability). */
export default function AdminExportsPage() {
  return (
    <>
      <PageHeader
        title="Exports"
        description="Download your data as a spreadsheet (CSV opens in Excel and Google Sheets) or as JSON. Downloads always contain the latest data."
      />
      <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border">
        {exportsList.map((item) => (
          <li key={item.key} className="flex flex-col gap-3 p-card sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-foreground">{item.title}</p>
              <p className="text-caption text-muted-foreground">{item.description}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <a
                href={`/api/admin/export?data=${item.key}&format=csv`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-body-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Download className="size-4" aria-hidden />
                Excel / CSV
              </a>
              <a
                href={`/api/admin/export?data=${item.key}&format=json`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-body-sm font-medium text-foreground hover:bg-accent"
              >
                JSON
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
