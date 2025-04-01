import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, Clock, Calendar, Pencil, Trash2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
    description,
    colorClass
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSubject(id, editFormData);
    setIsEditDialogOpen(false);
  };

  const colorOptions = [
    { value: 'border-blue-500', label: 'Blue' },
    { value: 'border-yellow-500', label: 'Yellow' },
    { value: 'border-green-500', label: 'Green' },
    { value: 'border-red-500', label: 'Red' },
    { value: 'border-purple-500', label: 'Purple' },
    { value: 'border-orange-500', label: 'Orange' }
  ];

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
        className={`relative rounded-lg shadow-sm overflow-hidden cursor-pointer transform transition-all duration-150 hover:shadow-md ${
          colorClass === 'border-blue-500' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
          colorClass === 'border-yellow-500' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
          colorClass === 'border-green-500' ? 'bg-gradient-to-r from-green-500 to-green-400' :
          colorClass === 'border-red-500' ? 'bg-gradient-to-r from-red-500 to-red-400' :
          colorClass === 'border-purple-500' ? 'bg-gradient-to-r from-purple-500 to-purple-400' :
          'bg-gradient-to-r from-orange-500 to-orange-400'
        }`}
      >
        <div className="relative">
          <div className="p-4" onClick={handleSubjectClick}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg text-white">{name}</h3>
              <div className="flex gap-1 items-center text-xs font-medium bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                <span>{formattedStudyTime}</span>
              </div>
            </div>
            
            <p className="text-sm text-white/80 mb-3">{description}</p>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="flex flex-col items-center justify-center p-1 bg-white/10 rounded-md text-white backdrop-blur-sm">
                <Clock className="h-4 w-4 mb-1" />
                <span className="text-xs">Study</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1 bg-white/10 rounded-md text-white backdrop-blur-sm">
                <BookOpen className="h-4 w-4 mb-1" />
                <span className="text-xs">Flashcards</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1 bg-white/10 rounded-md text-white backdrop-blur-sm">
                <Calendar className="h-4 w-4 mb-1" />
                <span className="text-xs">Tasks</span>
              </div>
            </div>
          </div>
          
          <div className="flex border-t border-white/10 text-sm">
            <button 
              className="flex-1 py-2 text-white hover:bg-white/10 flex justify-center"
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
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm pt-2">
                  Color
                </label>
                <RadioGroup
                  value={editFormData.colorClass}
                  onValueChange={(value) => setEditFormData({ ...editFormData, colorClass: value })}
                  className="col-span-3 flex flex-wrap gap-4"
                >
                  {colorOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.value} 
                        id={option.value}
                        className={option.value.replace('border', 'text')} 
                      />
                      <label htmlFor={option.value} className="cursor-pointer text-sm">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
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
