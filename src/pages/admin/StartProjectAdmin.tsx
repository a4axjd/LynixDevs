import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Loader2, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProjectInquiry {
  id: string;
  name: string;
  email: string;
  title: string;
  description: string;
  goals?: string;
  timeline?: string;
  budget?: string;
  phone?: string;
  company?: string;
  audience?: string;
  competitors?: string;
  references?: string;
  files?: string[]; // URLs
  status?: string;
  created_at: string;
}

const statusColor = (status?: string) => {
  switch (status) {
    case "contacted":
      return "bg-green-200 text-green-700";
    case "pending":
      return "bg-yellow-200 text-yellow-700";
    case "archived":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-blue-200 text-blue-700";
  }
};

const StartProjectsAdmin = () => {
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [view, setView] = useState<ProjectInquiry | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/start-project/admin/list`,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("admin_token") || ""
              }`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch start project inquiries");
        const data = await res.json();
        setInquiries(data);
      } catch (err: any) {
        toast({
          title: "Failed to fetch",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-lynix-purple drop-shadow-[0_2px_12px_rgba(139,92,246,0.20)]">
            Start Project Requests
          </h1>
          <p className="text-muted-foreground">
            All project requests submitted via the Start Project form.
          </p>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-32">
          <Loader2 className="h-8 w-8 animate-spin text-lynix-purple mb-4" />
          <p className="text-muted-foreground">Loading project requests...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32">
          <h2 className="text-xl font-semibold mt-4 mb-2">
            No Start Project Requests
          </h2>
          <p className="text-muted-foreground">No submissions found yet.</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Project Submissions</CardTitle>
            <CardDescription>
              Click "View" to see full details and files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="w-full text-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Date</th>
                    <th className="px-4 py-2 text-left font-semibold">Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Email</th>
                    <th className="px-4 py-2 text-left font-semibold">Title</th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-2 text-center font-semibold">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => (
                    <tr
                      key={inq.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-2">
                        {inq.created_at &&
                        !isNaN(new Date(inq.created_at).getTime())
                          ? format(new Date(inq.created_at), "MMM d, yyyy")
                          : "—"}
                      </td>
                      <td className="px-4 py-2">{inq.name}</td>
                      <td className="px-4 py-2">
                        <a
                          href={`mailto:${inq.email}`}
                          className="underline text-blue-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {inq.email}
                        </a>
                      </td>
                      <td className="px-4 py-2">{inq.title}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${statusColor(
                            inq.status
                          )}`}
                        >
                          {inq.status
                            ? inq.status.charAt(0).toUpperCase() +
                              inq.status.slice(1)
                            : "New"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setView(inq)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl w-full">
                            <DialogTitle>
                              {view?.title || "Project Details"}
                            </DialogTitle>
                            <DialogDescription>
                              Submitted on{" "}
                              {view?.created_at &&
                              !isNaN(new Date(view.created_at).getTime())
                                ? format(new Date(view.created_at), "PPpp")
                                : ""}
                            </DialogDescription>
                            <div className="space-y-2 text-base mt-2">
                              <div className="flex flex-col md:flex-row md:gap-8">
                                <div className="space-y-1 flex-1">
                                  <div>
                                    <span className="font-semibold">Name:</span>{" "}
                                    {view?.name}
                                  </div>
                                  <div>
                                    <span className="font-semibold">
                                      Email:
                                    </span>{" "}
                                    <a
                                      href={`mailto:${view?.email}`}
                                      className="underline text-blue-700"
                                    >
                                      {view?.email}
                                    </a>
                                  </div>
                                  {view?.phone && (
                                    <div>
                                      <span className="font-semibold">
                                        Phone:
                                      </span>{" "}
                                      {view.phone}
                                    </div>
                                  )}
                                  {view?.company && (
                                    <div>
                                      <span className="font-semibold">
                                        Company:
                                      </span>{" "}
                                      {view.company}
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-semibold">
                                      Status:
                                    </span>{" "}
                                    <span
                                      className={`px-2 py-1 rounded text-xs ${statusColor(
                                        view?.status
                                      )}`}
                                    >
                                      {view?.status
                                        ? view.status.charAt(0).toUpperCase() +
                                          view.status.slice(1)
                                        : "New"}
                                    </span>
                                  </div>
                                </div>
                                <div className="space-y-1 flex-1">
                                  <div>
                                    <span className="font-semibold">
                                      Timeline:
                                    </span>{" "}
                                    {view?.timeline || "—"}
                                  </div>
                                  <div>
                                    <span className="font-semibold">
                                      Budget:
                                    </span>{" "}
                                    {view?.budget || "—"}
                                  </div>
                                  <div>
                                    <span className="font-semibold">
                                      Audience:
                                    </span>{" "}
                                    {view?.audience || "—"}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="font-semibold">
                                  Description:
                                </span>
                                <div className="bg-muted p-2 rounded mt-1">
                                  {view?.description}
                                </div>
                              </div>
                              {view?.goals && (
                                <div>
                                  <span className="font-semibold">
                                    Goals/Objectives:
                                  </span>
                                  <div className="bg-muted p-2 rounded mt-1">
                                    {view.goals}
                                  </div>
                                </div>
                              )}
                              {view?.competitors && (
                                <div>
                                  <span className="font-semibold">
                                    Competitors/Inspiration:
                                  </span>
                                  <div className="bg-muted p-2 rounded mt-1">
                                    {view.competitors}
                                  </div>
                                </div>
                              )}
                              {view?.references && (
                                <div>
                                  <span className="font-semibold">
                                    References:
                                  </span>
                                  <div className="bg-muted p-2 rounded mt-1 space-y-1">
                                    {view.references
                                      .split(/[\s,]+/)
                                      .filter(Boolean)
                                      .map((ref, idx) =>
                                        /^https?:\/\//.test(ref) ? (
                                          <div key={idx}>
                                            <a
                                              href={ref}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-700 underline"
                                            >
                                              {ref}
                                            </a>
                                          </div>
                                        ) : (
                                          <span key={idx}>{ref} </span>
                                        )
                                      )}
                                  </div>
                                </div>
                              )}
                              {view?.files && view.files.length > 0 && (
                                <div>
                                  <span className="font-semibold">Files:</span>
                                  <ul className="pl-4 mt-1 space-y-1 list-disc">
                                    {view.files.map((url, i) => (
                                      <li key={url}>
                                        <a
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-blue-700 underline"
                                        >
                                          Download{" "}
                                          <Download className="h-4 w-4" />
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StartProjectsAdmin;
