import React from 'react';
import Card from './Card';
import Badge from './Badge';

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  note?: string;
  noteVariant?: 'brand' | 'success' | 'danger' | 'neutral';
  wide?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  description,
  note,
  noteVariant = 'brand',
  wide = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <Card className={`${wide ? 'max-w-2xl' : 'max-w-md'} w-full p-8`} hoverable>
        <div className="w-16 h-16 bg-radar-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-radar-500">
          {icon}
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{description}</p>
        {note && (
          <Badge variant={noteVariant} className="w-full justify-center py-3">
            {note}
          </Badge>
        )}
      </Card>
    </div>
  );
};

export default PageHeader;