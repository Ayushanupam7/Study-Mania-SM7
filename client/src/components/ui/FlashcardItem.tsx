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
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStudyContext } from '@/context/StudyContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FlashcardItemProps = {
  id: number;
  question: string;
  answer: string;
  subjectId: number;
  onClick?: () => void;
};

const FlashcardItem = ({ id, question, answer, subjectId, onClick }: FlashcardItemProps) => {
  const { updateFlashcard, deleteFlashcard, subjects } = useStudyContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editFormData, setEditFormData] = useState({
    question,
    answer,
    subjectId
  });

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFlashcard(id, editFormData);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteFlashcard(id);
    setIsDeleteDialogOpen(false);
  };

  const subject = subjects.find(s => s.id === subjectId);

  return (
    <>
      <Card 
        className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="p-4">
          <div className="mb-1 text-xs text-slate-500">
            {isFlipped ? 'Answer' : 'Question'}
          </div>
          <p className="text-slate-800 font-medium">
            {isFlipped ? answer : question}
          </p>
        </div>
        <div className="flex justify-end p-2 border-t border-slate-100 bg-slate-50">
          <button
            className="p-1 text-slate-600 hover:text-blue-600 mr-2"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditDialogOpen(true);
            }}
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            className="p-1 text-slate-600 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Flashcard</DialogTitle>
              <DialogDescription>
                Make changes to your flashcard here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="subject" className="text-right text-sm">
                  Subject
                </label>
                <Select 
                  value={editFormData.subjectId.toString()} 
                  onValueChange={(value) => setEditFormData({
                    ...editFormData,
                    subjectId: parseInt(value)
                  })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="question" className="text-right text-sm">
                  Question
                </label>
                <Textarea
                  id="question"
                  value={editFormData.question}
                  onChange={(e) => setEditFormData({ 
                    ...editFormData, 
                    question: e.target.value 
                  })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="answer" className="text-right text-sm">
                  Answer
                </label>
                <Textarea
                  id="answer"
                  value={editFormData.answer}
                  onChange={(e) => setEditFormData({ 
                    ...editFormData, 
                    answer: e.target.value 
                  })}
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
              Are you sure you want to delete this flashcard? This action cannot be undone.
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

export default FlashcardItem;
