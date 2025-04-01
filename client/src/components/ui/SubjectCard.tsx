import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStudyContext } from '@/context/StudyContext';
import { formatStudyTime } from '@/lib/utils';

type SubjectCardProps = {
  id: number;
  name: string;
  description: string;
  colorClass: string;
  totalStudyTime: number;
};

const SubjectCard = ({ id, name, description, colorClass, totalStudyTime }: SubjectCardProps) => {
  const { updateSubject, deleteSubject } = useStudyContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name,
    description
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSubject(id, editFormData);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteSubject(id);
    setIsDeleteDialogOpen(false);
  };

  const formattedStudyTime = formatStudyTime(totalStudyTime);

  return (
    <>
      <Card className={`bg-white rounded-lg shadow-sm overflow-hidden border-t-4 ${colorClass}`}>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{name}</h3>
          <p className="text-sm text-slate-600 mb-2">{description}</p>
          <p className="text-xs text-slate-500">Total study time: {formattedStudyTime}</p>
        </div>
        <div className="flex border-t border-slate-100 text-sm">
          <button 
            className="flex-1 py-2 text-slate-600 hover:bg-slate-50 flex justify-center"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button 
            className="flex-1 py-2 text-slate-600 hover:bg-slate-50 flex justify-center"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
              <DialogDescription>
                Make changes to your subject here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm">
                  Name
                </label>
                <Input
                  id="name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
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
              Are you sure you want to delete the subject "{name}"? This action cannot be undone.
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

export default SubjectCard;
