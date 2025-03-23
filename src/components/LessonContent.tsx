
import React from 'react';
import { Lesson } from '@/context/CourseContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, Film } from 'lucide-react';

type LessonContentProps = {
  lesson: Lesson;
  onComplete: () => void;
  isCompleted: boolean;
  isLoading?: boolean;
  className?: string;
};

const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  onComplete,
  isCompleted,
  isLoading = false,
  className,
}) => {
  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden mb-4">
            <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
              <Film size={48} className="opacity-20" />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Video content would be embedded here in a production environment
            </p>
          </div>
        );
      case 'pdf':
        return (
          <div className="w-full bg-muted rounded-lg overflow-hidden mb-4 p-8 flex flex-col items-center justify-center">
            <FileText size={48} className="opacity-20 mb-2" />
            <p className="text-sm text-muted-foreground">
              PDF content would be embedded here in a production environment
            </p>
            <Button variant="outline" className="mt-4">
              Download PDF
            </Button>
          </div>
        );
      case 'text':
      default:
        return (
          <div className="prose prose-sm max-w-none mb-4">
            <p>{lesson.content}</p>
          </div>
        );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{lesson.title}</h2>
        <p className="text-muted-foreground">{lesson.description}</p>
      </div>
      
      <div className="border-t border-border my-4 pt-4">
        {renderContent()}
      </div>
      
      <div className="flex justify-end">
        <Button
          variant={isCompleted ? "outline" : "default"}
          className="gap-2"
          onClick={onComplete}
          disabled={isCompleted || isLoading}
        >
          <CheckCircle size={16} />
          {isLoading ? 'Saving...' : isCompleted ? 'Completed' : 'Mark as Complete'}
        </Button>
      </div>
    </div>
  );
};

export default LessonContent;
