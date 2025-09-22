import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useImportAutovitListing } from '@/hooks/useAdminListings';

interface AutovitImportFormProps {
  onImported?: (autovitId: string | null) => void;
}

const AutovitImportForm = ({ onImported }: AutovitImportFormProps) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT'>('ACTIVE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const importListing = useImportAutovitListing();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!url.trim()) {
      setErrorMessage('Introdu link-ul complet al anunțului din Autovit.');
      return;
    }

    try {
      const result = await importListing.mutateAsync({ url: url.trim(), status });
      setUrl('');
      onImported?.(result?.autovit_id ?? null);
    } catch (error: any) {
      setErrorMessage(error.message ?? 'Importul a eșuat. Verifică link-ul și încearcă din nou.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">Link Autovit *</label>
        <Input
          placeholder="https://www.autovit.ro/autoturisme/anunt/..."
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Status după import</label>
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={status}
          onChange={(event) => setStatus(event.target.value as 'ACTIVE' | 'DRAFT')}
        >
          <option value="ACTIVE">ACTIVE (publicat imediat)</option>
          <option value="DRAFT">DRAFT (vizibil doar în admin)</option>
        </select>
      </div>
      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
      <Button type="submit" className="w-full" disabled={importListing.isPending}>
        {importListing.isPending ? 'Se importă...' : 'Importă din Autovit'}
      </Button>
    </form>
  );
};

export default AutovitImportForm;
