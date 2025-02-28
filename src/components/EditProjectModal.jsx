import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditProjectModal({ open, onClose, project, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Sync project data when modal opens
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [project]);

  // Handle Save
  const handleSave = () => {
    if (!title.trim() || !description.trim()) return;
    onSave({ ...project, title, description });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">{project ? "Edit Project" : "New Project"}</h2>
        <Input placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Project Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button onClick={handleSave}>{project ? "Update" : "Create"}</Button>
      </DialogContent>
    </Dialog>
  );
}
