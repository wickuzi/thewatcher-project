'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';

export default function CatalogSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Update search query when URL changes
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('q') as string;
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    router.push(`/catalog${params.toString() ? `?${params.toString()}` : ''}`);
  }, [router]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          placeholder="Buscar relojes por nombre, marca o categoría..."
          className="pl-10 pr-4 py-6 text-base text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
          Buscar
        </Button>
      </div>
    </form>
  );
}
