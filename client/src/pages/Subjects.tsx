import { useState } from 'react';
import { useStudyContext } from '@/context/StudyContext';
import { Button } from '@/components/ui/button';
import SubjectCard from '@/components/ui/SubjectCard';
import { Plus } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Subjects = () => {
  const { subjects, createSubject } = useStudyContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    colorClass: 'border-blue-500'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSubject(formData);
    setFormData({
      name: '',
      description: '',
      colorClass: 'border-blue-500'
    });
    setIsDialogOpen(false);
  };

  const colorOptions = [
    { value: 'border-blue-500', label: 'Blue' },
    { value: 'border-yellow-500', label: 'Yellow' },
    { value: 'border-green-500', label: 'Green' },
    { value: 'border-red-500', label: 'Red' },
    { value: 'border-purple-500', label: 'Purple' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Subjects</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="px-4 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Create a new subject to organize your study materials.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">
                    Color
                  </Label>
                  <RadioGroup
                    value={formData.colorClass}
                    onValueChange={(value) => setFormData({ ...formData, colorClass: value })}
                    className="col-span-3 flex gap-4"
                  >
                    {colorOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option.value} 
                          id={option.value}
                          className={option.value.replace('border', 'text')} 
                        />
                        <Label htmlFor={option.value} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Subject</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              id={subject.id}
              name={subject.name}
              description={subject.description}
              colorClass={subject.colorClass}
              totalStudyTime={subject.totalStudyTime}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
            <h3 className="text-lg font-medium text-slate-600 mb-2">No subjects added yet</h3>
            <p className="text-slate-500 mb-4">Create your first subject to start studying.</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-md font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Subject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subjects;
