
import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '@/context/CourseContext';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

type CourseCardProps = {
  course: Course;
  progress?: number;
  href: string;
  className?: string;
};

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  progress, 
  href,
  className
}) => {
  return (
    <Link 
      to={href}
      className={cn(
        "group block overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:shadow-md hover:translate-y-[-4px]",
        className
      )}
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors">
            {course.category}
          </span>
          {course.lessons.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {course.lessons.length} {course.lessons.length === 1 ? 'lesson' : 'lessons'}
            </span>
          )}
        </div>
        
        <h3 className="font-medium text-base line-clamp-1 mb-1">{course.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {course.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium">
            {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
          </span>
          <span className="text-xs text-muted-foreground">
            by {course.instructor}
          </span>
        </div>
        
        {typeof progress === 'number' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
