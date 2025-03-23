
import React from 'react';
import { Lesson } from '@/context/CourseContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, File, FileText, Play, Lock } from 'lucide-react';

type LessonListProps = {
  lessons: Lesson[];
  completedLessons?: string[];
  onSelectLesson: (lesson: Lesson) => void;
  currentLessonId?: string;
  locked?: boolean;
};

const LessonList: React.FC<LessonListProps> = ({
  lessons,
  completedLessons = [],
  onSelectLesson,
  currentLessonId,
  locked = false,
}) => {
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.type === 'video') return Play;
    if (lesson.type === 'pdf') return File;
    return FileText;
  };

  return (
    <div className="space-y-2">
      {sortedLessons.map((lesson) => {
        const Icon = getLessonIcon(lesson);
        const isCompleted = completedLessons.includes(lesson.id);
        const isActive = currentLessonId === lesson.id;
        
        return (
          <div
            key={lesson.id}
            className={cn(
              "p-3 rounded-md transition-all border border-border/50",
              isActive ? "bg-primary/5 border-primary/50" : "bg-card hover:bg-accent/50"
            )}
          >
            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto font-normal"
              onClick={() => onSelectLesson(lesson)}
              disabled={locked}
            >
              <div className="flex items-start w-full">
                <div className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full mr-3 shrink-0",
                  isCompleted ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-medium leading-tight">{lesson.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{lesson.description}</p>
                  {lesson.duration && (
                    <p className="text-xs text-muted-foreground mt-1">{lesson.duration} min</p>
                  )}
                </div>
                {locked && (
                  <div className="flex items-center ml-2">
                    <Lock size={16} className="text-muted-foreground" />
                  </div>
                )}
              </div>
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default LessonList;
