import { Badge } from '@/components/ui/badge';

const CATEGORIES = {
  'Writing & Content': 'writing',
  'Code & Development': 'code',
  'Business & Productivity': 'business',
  'Education & Learning': 'education',
  'Creative & Design': 'creative',
  'Data & Analysis': 'data',
  'Personal & Lifestyle': 'personal',
  'Other': 'other'
} as const;

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const categoryKey = Object.values(CATEGORIES).find(
    key => category.toLowerCase().includes(key)
  ) || 'other';

  return (
    <Badge 
      variant="secondary"
      className={`bg-category-${categoryKey}/20 text-category-${categoryKey} border-category-${categoryKey}/30 ${className}`}
    >
      {category}
    </Badge>
  );
}

export const CATEGORY_LIST = Object.keys(CATEGORIES);
