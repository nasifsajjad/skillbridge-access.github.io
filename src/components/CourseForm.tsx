
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '@/context/CourseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

type CourseFormProps = {
  initialData?: Partial<Course>;
  onSubmit: (data: Partial<Course>) => Promise<void>;
  isLoading: boolean;
};

const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  onSubmit,
  isLoading
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Course>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    instructor: initialData?.instructor || '',
    thumbnail: initialData?.thumbnail || '',
    category: initialData?.category || '',
    price: initialData?.price || 0,
    published: initialData?.published ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      published: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!formData.title?.trim()) {
        toast.error('Title is required');
        return;
      }
      
      if (!formData.description?.trim()) {
        toast.error('Description is required');
        return;
      }
      
      if (!formData.instructor?.trim()) {
        toast.error('Instructor name is required');
        return;
      }
      
      if (!formData.category?.trim()) {
        toast.error('Category is required');
        return;
      }
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to Digital Design"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="e.g. Jane Smith"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a detailed description of your course"
            rows={4}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Design, Programming, Business"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail URL</Label>
          <Input
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            required
          />
          
          {formData.thumbnail && (
            <div className="mt-2 aspect-video w-full max-w-xs bg-muted rounded-md overflow-hidden">
              <img
                src={formData.thumbnail}
                alt="Thumbnail preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                }}
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={handleToggleChange}
          />
          <Label htmlFor="published">Published</Label>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData?.id ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;
