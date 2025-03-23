import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses, Lesson } from '@/context/CourseContext';
import MainLayout from '@/layouts/MainLayout';
import CourseFormComponent from '@/components/CourseForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Plus,
  Trash,
  FileText,
  Video,
  PenLine,
  GripVertical,
} from 'lucide-react';
import { Course } from '@/context/CourseContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

// React DnD would be ideal here, but keeping it simple for demo
const AdminCourseForm = () => {
  const { id } = useParams<{ id: string }>();
  const isNewCourse = !id;
  const navigate = useNavigate();
  
  const { getCourse, createCourse, updateCourse, addLesson, updateLesson, deleteLesson, loading } = useCourses();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Partial<Lesson> | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  
  // Load course data if editing an existing course
  useEffect(() => {
    if (!isNewCourse && id) {
      const existingCourse = getCourse(id);
      if (existingCourse) {
        setCourse(existingCourse);
        setLessons([...existingCourse.lessons].sort((a, b) => a.order - b.order));
      } else {
        // Course not found
        toast.error('Course not found');
        navigate('/admin/courses');
      }
    }
  }, [id, isNewCourse, getCourse, navigate]);
  
  const handleCreateCourse = async (data: Partial<Course>) => {
    try {
      const newCourse = await createCourse({
        ...data as Omit<Course, 'id' | 'createdAt' | 'updatedAt'>,
        lessons: [],
      });
      
      toast.success('Course created successfully');
      navigate(`/admin/courses/${newCourse.id}`);
    } catch (error) {
      console.error('Create course error:', error);
    }
  };
  
  const handleUpdateCourse = async (data: Partial<Course>) => {
    if (!course) return;
    
    try {
      await updateCourse(course.id, data);
      toast.success('Course updated successfully');
    } catch (error) {
      console.error('Update course error:', error);
    }
  };
  
  const openAddLessonDialog = () => {
    setCurrentLesson({
      title: '',
      description: '',
      type: 'text',
      content: '',
      order: lessons.length > 0 ? Math.max(...lessons.map(l => l.order)) + 1 : 1,
    });
    setIsLessonDialogOpen(true);
  };
  
  const openEditLessonDialog = (lesson: Lesson) => {
    setCurrentLesson({ ...lesson });
    setIsLessonDialogOpen(true);
  };
  
  const handleSaveLesson = async () => {
    if (!currentLesson || !course) return;
    
    try {
      if ('id' in currentLesson && currentLesson.id) {
        // Update existing lesson
        await updateLesson(
          course.id, 
          currentLesson.id, 
          currentLesson as Partial<Lesson>
        );
        
        // Update local state
        setLessons(prev => 
          prev.map(l => l.id === currentLesson.id ? { ...l, ...currentLesson } : l)
            .sort((a, b) => a.order - b.order)
        );
        
        toast.success('Lesson updated successfully');
      } else {
        // Create new lesson
        const newLesson = await addLesson(
          course.id, 
          currentLesson as Omit<Lesson, 'id'>
        );
        
        // Add to local state
        setLessons(prev => [...prev, newLesson].sort((a, b) => a.order - b.order));
        
        toast.success('Lesson added successfully');
      }
      
      setIsLessonDialogOpen(false);
    } catch (error) {
      console.error('Save lesson error:', error);
    }
  };
  
  const handleDeleteLesson = async () => {
    if (!lessonToDelete || !course) return;
    
    try {
      await deleteLesson(course.id, lessonToDelete);
      
      // Update local state
      setLessons(prev => prev.filter(l => l.id !== lessonToDelete));
      
      toast.success('Lesson deleted successfully');
    } catch (error) {
      console.error('Delete lesson error:', error);
    } finally {
      setLessonToDelete(null);
    }
  };
  
  // Reorder lessons (move up or down)
  const reorderLesson = (lessonId: string, direction: 'up' | 'down') => {
    if (!course) return;
    
    const lessonIndex = lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex === -1) return;
    
    // Can't move first lesson up or last lesson down
    if (
      (direction === 'up' && lessonIndex === 0) || 
      (direction === 'down' && lessonIndex === lessons.length - 1)
    ) {
      return;
    }
    
    const newLessons = [...lessons];
    const swapIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    
    // Swap the order values
    const tempOrder = newLessons[lessonIndex].order;
    newLessons[lessonIndex].order = newLessons[swapIndex].order;
    newLessons[swapIndex].order = tempOrder;
    
    // Update both lessons
    Promise.all([
      updateLesson(course.id, newLessons[lessonIndex].id, { order: newLessons[lessonIndex].order }),
      updateLesson(course.id, newLessons[swapIndex].id, { order: newLessons[swapIndex].order })
    ])
      .then(() => {
        // Sort lessons by new order
        setLessons([...newLessons].sort((a, b) => a.order - b.order));
      })
      .catch(error => {
        console.error('Reorder lesson error:', error);
        toast.error('Failed to reorder lessons');
      });
  };
  
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'pdf': return <FileText size={16} />;
      default: return <PenLine size={16} />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/admin/courses')}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to courses
        </Button>
        
        <h1 className="text-3xl font-bold tracking-tight">
          {isNewCourse ? 'Create New Course' : 'Edit Course'}
        </h1>
        
        <div className="space-y-8">
          {/* Course Details */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-6">Course Details</h2>
            <CourseFormComponent
              initialData={course || undefined}
              onSubmit={isNewCourse ? handleCreateCourse : handleUpdateCourse}
              isLoading={loading}
            />
          </div>
          
          {/* Lesson Management (only for existing courses) */}
          {!isNewCourse && course && (
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Course Lessons</h2>
                <Button onClick={openAddLessonDialog}>
                  <Plus size={16} className="mr-2" />
                  Add Lesson
                </Button>
              </div>
              
              {lessons.length > 0 ? (
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div 
                      key={lesson.id}
                      className="flex items-center space-x-4 p-4 border rounded-md bg-background"
                    >
                      <div className="flex items-center text-muted-foreground">
                        <GripVertical size={16} className="cursor-move" />
                      </div>
                      
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {getLessonIcon(lesson.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {lesson.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => reorderLesson(lesson.id, 'up')}
                          disabled={index === 0}
                          className={cn(index === 0 && "opacity-50")}
                        >
                          <ArrowLeft size={16} className="rotate-90" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => reorderLesson(lesson.id, 'down')}
                          disabled={index === lessons.length - 1}
                          className={cn(index === lessons.length - 1 && "opacity-50")}
                        >
                          <ArrowLeft size={16} className="rotate-[-90deg]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditLessonDialog(lesson)}
                        >
                          <PenLine size={16} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setLessonToDelete(lesson.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this lesson? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={handleDeleteLesson}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">No lessons added yet</p>
                  <Button onClick={openAddLessonDialog}>
                    Add your first lesson
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Lesson Dialog */}
      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {'id' in currentLesson! && currentLesson!.id ? 'Edit Lesson' : 'Add New Lesson'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for this lesson
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                value={currentLesson?.title || ''}
                onChange={(e) => setCurrentLesson(prev => ({ ...prev!, title: e.target.value }))}
                placeholder="e.g. Introduction to React"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentLesson?.description || ''}
                onChange={(e) => setCurrentLesson(prev => ({ ...prev!, description: e.target.value }))}
                placeholder="Briefly describe what this lesson covers"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lesson-type">Lesson Type</Label>
              <Select
                value={currentLesson?.type || 'text'}
                onValueChange={(value) => setCurrentLesson(prev => ({ ...prev!, type: value as 'text' | 'video' | 'pdf' }))}
              >
                <SelectTrigger id="lesson-type">
                  <SelectValue placeholder="Select lesson type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">
                {currentLesson?.type === 'video' ? 'Video URL' : 
                 currentLesson?.type === 'pdf' ? 'PDF URL' : 
                 'Content'}
              </Label>
              
              {currentLesson?.type === 'text' ? (
                <Textarea
                  id="content"
                  value={currentLesson?.content || ''}
                  onChange={(e) => setCurrentLesson(prev => ({ ...prev!, content: e.target.value }))}
                  placeholder="Enter the lesson content here"
                  rows={5}
                />
              ) : (
                <Input
                  id="content"
                  value={currentLesson?.content || ''}
                  onChange={(e) => setCurrentLesson(prev => ({ ...prev!, content: e.target.value }))}
                  placeholder={`Enter the ${currentLesson?.type} URL`}
                />
              )}
            </div>
            
            {currentLesson?.type === 'video' && (
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={currentLesson?.duration || ''}
                  onChange={(e) => setCurrentLesson(prev => ({ ...prev!, duration: parseInt(e.target.value) || undefined }))}
                  placeholder="e.g. 15"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLessonDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLesson}>
              {'id' in currentLesson! && currentLesson!.id ? 'Update Lesson' : 'Add Lesson'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminCourseForm;
