import { useState } from 'react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil, Trash2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStudyContext } from '@/context/StudyContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PlannerItemProps = {
  id: number;
  title: string;
  description: string;
  date: Date;
  isCompleted: boolean;
  subjectId: number | null;
};

const PlannerItem = ({ 
  id, 
  title, 
  description, 
  date, 
  isCompleted,
  subjectId
}: PlannerItemProps) => {
  const { updatePlannerItem, deletePlannerItem, subjects } = useStudyContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title,
    description,
    isCompleted,
    subjectId
  });

  const handleToggleCompletion = () => {
    updatePlannerItem(id, { 
      ...editFormData,
      isCompleted: !isCompleted
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlannerItem(id, editFormData);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    deletePlannerItem(id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="p-4">
        <div className="flex items-start">
          <Checkbox 
            id={`task-${id}`}
            checked={isCompleted}
            onCheckedChange={handleToggleCompletion}
            className="h-5 w-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
          />
          <div className="flex-grow">
            <h4 className={`font-medium mb-1 ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
              {title}
            </h4>
            <p className="text-sm text-slate-600 mb-1">{description}</p>
            <p className="text-xs text-slate-500">{format(new Date(date), 'hh:mm a')}</p>
          </div>
          <div className="flex space-x-2 ml-4">
            <button 
              className="p-1 text-slate-400 hover:text-blue-500"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button 
              className="p-1 text-slate-400 hover:text-red-500"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Make changes to your task here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right text-sm">
                  Title
                </label>
                <Input
                  id="title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right text-sm">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="subject" className="text-right text-sm">
                  Subject
                </label>
                <Select 
                  value={editFormData.subjectId?.toString() || ''} 
                  onValueChange={(value) => setEditFormData({
                    ...editFormData,
                    subjectId: value ? parseInt(value) : null
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Subject</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">
                  Completed
                </label>
                <div className="col-span-3 flex items-center">
                  <Checkbox 
                    id="isCompleted"
                    checked={editFormData.isCompleted}
                    onCheckedChange={(checked) => 
                      setEditFormData({ 
                        ...editFormData, 
                        isCompleted: checked as boolean 
                      })
                    }
                  />
                  <label htmlFor="isCompleted" className="ml-2 text-sm font-medium">
                    Mark as completed
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlannerItem;
