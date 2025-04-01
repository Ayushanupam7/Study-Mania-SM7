import { useState } from 'react';
import { useStudyContext } from '@/context/StudyContext';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import FlashcardItem from '@/components/ui/FlashcardItem';

const Flashbook = () => {
  const { flashcards, subjects, createFlashcard } = useStudyContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [studyMode, setStudyMode] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    subjectId: subjects.length > 0 ? subjects[0].id : 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createFlashcard(formData);
    setFormData({
      question: '',
      answer: '',
      subjectId: subjects.length > 0 ? subjects[0].id : 1
    });
    setIsDialogOpen(false);
  };

  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || card.subjectId.toString() === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  // Group flashcards by subject
  const flashcardsBySubject = filteredFlashcards.reduce<Record<number, typeof filteredFlashcards>>((acc, card) => {
    if (!acc[card.subjectId]) {
      acc[card.subjectId] = [];
    }
    acc[card.subjectId].push(card);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold">Flashbook</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-slate-700">Study Mode</span>
            <Switch 
              checked={studyMode}
              onCheckedChange={setStudyMode}
              className="bg-gray-200 data-[state=checked]:bg-blue-500"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="px-4 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Add Flashcard
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Flashcard</DialogTitle>
                  <DialogDescription>
                    Create a new flashcard to help your study.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject" className="text-right">
                      Subject
                    </Label>
                    <Select 
                      value={formData.subjectId.toString()}
                      onValueChange={(value) => 
                        setFormData({ ...formData, subjectId: parseInt(value) })
                      }
                      disabled={subjects.length === 0}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.length > 0 ? (
                          subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id.toString()}>
                              {subject.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="0" disabled>
                            No subjects available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="question" className="text-right">
                      Question
                    </Label>
                    <Textarea
                      id="question"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="answer" className="text-right">
                      Answer
                    </Label>
                    <Textarea
                      id="answer"
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={subjects.length === 0}>
                    {subjects.length === 0 ? 'Add a subject first' : 'Add Flashcard'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <p className="text-slate-600 mb-6">{flashcards.length} cards available</p>
      
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <Input
            type="text"
            className="pl-10 pr-3 py-2"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-auto">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Flashcard List */}
      {subjects.length > 0 && filteredFlashcards.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(flashcardsBySubject).map(([subjectId, cards]) => {
            const subject = subjects.find(s => s.id === parseInt(subjectId));
            if (!subject) return null;
            
            const colorClass = subject.colorClass.replace('border', 'text');
            
            return (
              <div key={subjectId}>
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${colorClass} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h2 className="font-medium text-lg">{subject.name}</h2>
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {cards.length} {cards.length === 1 ? 'card' : 'cards'}
                  </span>
                </div>
                
                {cards.map((card) => (
                  <FlashcardItem
                    key={card.id}
                    id={card.id}
                    question={card.question}
                    answer={card.answer}
                    subjectId={card.subjectId}
                  />
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
          {subjects.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-slate-600 mb-2">No subjects available</h3>
              <p className="text-slate-500 mb-4">Create a subject before adding flashcards.</p>
              <Button 
                asChild
                className="px-4 py-2 bg-primary text-white rounded-md font-medium"
              >
                <a href="/subjects">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Subject
                </a>
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-slate-600 mb-2">No flashcards found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm || selectedSubject !== 'all' 
                  ? 'Try changing your search or filter.' 
                  : 'Create your first flashcard to start studying.'}
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('all');
                  if (!flashcards.length) {
                    setIsDialogOpen(true);
                  }
                }}
                className="px-4 py-2 bg-primary text-white rounded-md font-medium"
              >
                {searchTerm || selectedSubject !== 'all' 
                  ? 'Clear Filters'
                  : (
                    <>
                      <Plus className="h-5 w-5 mr-2" />
                      Add Flashcard
                    </>
                  )}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Flashbook;
