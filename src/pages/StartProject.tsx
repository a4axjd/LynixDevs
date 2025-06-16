import { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useToast } from "@/components/ui/use-toast";

const initialForm = (user: any) => ({
  name: user?.user_metadata?.full_name || "",
  email: user?.email || "",
  title: "",
  description: "",
  budget: "",
  phone: "",
  company: "",
  goals: "",
  timeline: "",
  competitors: "",
  audience: "",
  reference: "",
});

const StartProject = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm(user));
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles(selected);

    // Basic preview for images
    const previews = selected.map((file) => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      }
      return "";
    });
    setFilePreviews(previews);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!form.name || !form.email || !form.title || !form.description) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      // Prepare form data for file upload
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });
      files.forEach((file) => {
        data.append("files", file);
      });

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/start-project`,
        {
          method: "POST",
          body: data,
        }
      );
      if (!res.ok) throw new Error("Submission failed, try again!");

      setSubmitted(true);
      toast({
        title: "Project Request Submitted!",
        description: "We've received your info and will be in touch soon.",
      });
      setForm(initialForm(user));
      setFiles([]);
      setFilePreviews([]);
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <DotLottieReact
          src="/assets/project-info.lottie"
          autoplay
          loop
          style={{ width: 120, height: 120 }}
        />
        <h2 className="text-2xl font-bold mt-4 text-lynix-purple">
          Thank you!
        </h2>
        <p className="text-muted-foreground mt-2 text-center max-w-md">
          Your project request has been received. We’ll be in touch soon!
        </p>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <DotLottieReact
          src="/assets/TechAnimation.lottie"
          autoplay
          loop
          style={{ width: 110, height: 110 }}
        />
        <h1 className="text-3xl font-bold text-lynix-purple drop-shadow-[0_2px_12px_rgba(139,92,246,0.20)] mt-4 mb-2">
          Start a Project
        </h1>
        <p className="text-muted-foreground text-center mb-2">
          Tell us about your project. We'll reach out to you promptly.
        </p>
      </div>
      <form
        className="space-y-5"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="goals">Project Goals & Objectives</Label>
          <Textarea
            id="goals"
            name="goals"
            value={form.goals}
            onChange={handleChange}
            rows={3}
            placeholder="What do you want to achieve?"
          />
        </div>
        <div>
          <Label htmlFor="timeline">Desired Timeline</Label>
          <Input
            id="timeline"
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            placeholder="e.g. 2-3 months, ASAP"
          />
        </div>
        <div>
          <Label htmlFor="budget">Budget (optional)</Label>
          <Input
            id="budget"
            name="budget"
            value={form.budget}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="audience">Target Audience</Label>
          <Input
            id="audience"
            name="audience"
            value={form.audience}
            onChange={handleChange}
            placeholder="Who is this project for?"
          />
        </div>
        <div>
          <Label htmlFor="competitors">Competitors / Inspiration</Label>
          <Textarea
            id="competitors"
            name="competitors"
            value={form.competitors}
            onChange={handleChange}
            rows={2}
            placeholder="List any similar brands/websites/apps"
          />
        </div>
        <div>
          <Label htmlFor="reference">Reference Links</Label>
          <Textarea
            id="reference"
            name="reference"
            value={form.reference}
            onChange={handleChange}
            rows={2}
            placeholder="Paste any relevant URLs"
          />
        </div>
        <div>
          <Label htmlFor="company">Company (optional)</Label>
          <Input
            id="company"
            name="company"
            value={form.company}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="files">
            Upload Files or Images (optional, multiple allowed)
          </Label>
          <Input
            id="files"
            name="files"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt,.csv,.svg,.webp"
            onChange={handleFileChange}
          />
          <div className="flex flex-wrap gap-3 mt-2">
            {filePreviews.filter(Boolean).map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="Preview"
                className="w-16 h-16 object-cover rounded border"
              />
            ))}
            {files.length > 0 && filePreviews.length === 0 && (
              <span className="text-xs text-muted-foreground">
                Files selected: {files.length}
              </span>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-lynix-purple text-white shadow-lg hover:shadow-xl drop-shadow-[0_2px_12px_rgba(139,92,246,0.20)]"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Project"}
        </Button>
      </form>
    </div>
  );
};

export default StartProject;
