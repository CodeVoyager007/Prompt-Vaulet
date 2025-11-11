import { Card } from '@/components/ui/card';
import { CategoryBadge } from './CategoryBadge';
import { Star, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface PromptCardProps {
  id: string;
  title: string;
  content: string;
  category: string;
  username: string;
  starCount: number;
  copyCount: number;
  createdAt: string;
}

export function PromptCard({
  id,
  title,
  content,
  category,
  username,
  starCount,
  copyCount,
  createdAt
}: PromptCardProps) {
  const preview = content.length > 120 ? content.slice(0, 120) + '...' : content;

  return (
    <Link to={`/prompt/${id}`}>
      <Card className="p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 group cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <CategoryBadge category={category} />
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
          {preview}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
          <span className="hover:text-foreground transition-colors">
            by {username}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{starCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Copy className="w-4 h-4" />
              <span>{copyCount}</span>
            </div>
            <span className="text-xs">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
