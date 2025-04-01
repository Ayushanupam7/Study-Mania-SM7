import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, Clock, Calendar, Pencil, Trash2 } from 'lucide-react';
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
import { useLocation } from 'wouter';

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

  const [, navigate] = useLocation();
  
  const handleSubjectClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Create a smooth transition effect
    const card = e.currentTarget;
    card.style.transform = 'scale(0.98)';
    card.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.5)';
    
    // Navigate after a short delay for visual effect
    setTimeout(() => {
      navigate(`/subjects/${id}`);
    }, 120);
  };
  
  return (
    <>
      <Card 
        className={`bg-white rounded-lg shadow-sm overflow-hidden border-t-4 ${colorClass} cursor-pointer transform transition-all duration-150 hover:shadow-md`}
      >
        <div className="relative">
          <div className="p-4" onClick={handleSubjectClick}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="flex gap-1 items-center text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                <span>{formattedStudyTime}</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-3">{description}</p>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="flex flex-col items-center justify-center p-1 bg-slate-50 rounded-md text-slate-600">
                <Clock className="h-4 w-4 mb-1" />
                <span className="text-xs">Study</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1 bg-slate-50 rounded-md text-slate-600">
                <BookOpen className="h-4 w-4 mb-1" />
                <span className="text-xs">Flashcards</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1 bg-slate-50 rounded-md text-slate-600">
                <Calendar className="h-4 w-4 mb-1" />
                <span className="text-xs">Tasks</span>
              </div>
            </div>
          </div>
          
          <div className="flex border-t border-slate-100 text-sm">
            <button 
              className="flex-1 py-2 text-slate-600 hover:bg-slate-50 flex justify-center"
              onClick={(e) => {
                e.preventDefault();
                setIsEditDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button 
              className="flex-1 py-2 text-slate-600 hover:bg-slate-50 flex justify-center"
              onClick={(e) => {
                e.preventDefault();
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
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
