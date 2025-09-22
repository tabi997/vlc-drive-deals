import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListingForm } from '@/components/admin/ListingForm';
import ManualListingForm from '@/components/admin/ManualListingForm';
import AutovitImportForm from '@/components/admin/AutovitImportForm';
import {
  useAdminListings,
  useSaveListing,
  useUpdateListingStatus,
  type AdminListingRecord,
  type ListingMutationPayload,
} from '@/hooks/useAdminListings';
import { supabase, hasSupabaseClient } from '@/lib/supabaseClient';
import { parseDescription } from '@/lib/description';

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-emerald-500 text-emerald-900',
  DRAFT: 'bg-amber-400 text-amber-900',
  ARCHIVED: 'bg-slate-300 text-slate-800',
};

const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [editingListing, setEditingListing] = useState<AdminListingRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'import' | 'manual' | 'edit'>('import');

  const queryClient = useQueryClient();
  const isAuthenticated = Boolean(session);
  const { data: listings = [], isLoading, refetch } = useAdminListings(isAuthenticated);
  const saveListing = useSaveListing();
  const updateStatus = useUpdateListingStatus();

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAuthError(error.message);
    } else {
      setEmail('');
      setPassword('');
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
    }
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    setEditingListing(null);
    setActiveTab('import');
  };

  const handleSaveListing = async (payload: ListingMutationPayload) => {
    try {
      const id = await saveListing.mutateAsync(payload);
      const result = await refetch();
      const updatedListing = result.data?.find((item) => item.id === id) ?? null;
      setEditingListing(updatedListing);
      setActiveTab(updatedListing ? 'edit' : 'manual');
    } catch (error: any) {
      alert(error.message ?? 'Salvarea anunțului a eșuat');
    }
  };

  const sortedListings = useMemo(() => {
    return listings.slice().sort((a, b) => {
      const getOrder = (status?: string | null) => {
        switch (status) {
          case 'ACTIVE':
            return 0;
          case 'DRAFT':
            return 1;
          default:
            return 2;
        }
      };
      const orderDiff = getOrder(a.status) - getOrder(b.status);
      if (orderDiff !== 0) return orderDiff;
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [listings]);

  if (!hasSupabaseClient || !supabase) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle>Configurare Supabase necesară</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Variabilele de mediu `VITE_SUPABASE_URL` și `VITE_SUPABASE_ANON_KEY` nu sunt setate. Completați `.env` și reporniți serverul de dezvoltare.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle>Autentificare administrator</CardTitle>
              <p className="text-sm text-muted-foreground">Introduceți credențialele configurate în Supabase.</p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Parolă</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                {authError && <p className="text-sm text-destructive">{authError}</p>}
                <Button type="submit" className="w-full">
                  Autentificare
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panou administrare anunțuri</h1>
            <p className="text-muted-foreground">Gestionează anunțurile sincronizate din Autovit sau adaugă unele noi manual.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" /> Reîmprospătează
            </Button>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Delogare
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Adaugă sau importă anunțuri</CardTitle>
              <p className="text-sm text-muted-foreground">
                Poți importa instant un anunț de pe Autovit sau îl poți introduce manual din câteva câmpuri esențiale. Selectarea unui anunț din listă deschide editorul complet.
              </p>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
                <TabsList className="flex w-full flex-wrap gap-2 bg-muted/40 p-1">
                  <TabsTrigger value="import" className="flex-1">Import Autovit</TabsTrigger>
                  <TabsTrigger value="manual" className="flex-1">Adaugă manual</TabsTrigger>
                  <TabsTrigger value="edit" className="flex-1" disabled={!editingListing}>Editează anunț</TabsTrigger>
                </TabsList>

                <TabsContent value="import" className="mt-4">
                  <AutovitImportForm
                    onImported={async (autovitId) => {
                      const result = await refetch();
                      if (autovitId && result.data) {
                        const imported = result.data.find((item) => item.autovitId === autovitId);
                        if (imported) {
                          setEditingListing(imported);
                          setActiveTab('edit');
                          return;
                        }
                      }
                      setActiveTab('manual');
                    }}
                  />
                </TabsContent>

                <TabsContent value="manual" className="mt-4">
                  <ManualListingForm
                    onSubmit={handleSaveListing}
                    isSubmitting={saveListing.isPending}
                  />
                </TabsContent>

                <TabsContent value="edit" className="mt-4">
                  {editingListing ? (
                    <ListingForm
                      listing={editingListing}
                      onSubmit={handleSaveListing}
                      onCancel={() => {
                        setEditingListing(null);
                        setActiveTab('manual');
                      }}
                      isSubmitting={saveListing.isPending}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Selectează un anunț din listă pentru a-l edita.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Anunțuri existente</CardTitle>
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Se încarcă anunțurile...' : `${listings.length} anunțuri găsite.`}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedListings.map((listing) => (
                <div
                  key={listing.id}
                  className="rounded-lg border border-border bg-card p-4 shadow-sm transition hover:border-accent"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-lg font-semibold text-foreground">{listing.title}</span>
                        {listing.status && (
                          <Badge className={statusColor[listing.status] ?? 'bg-muted text-foreground'}>
                            {listing.status}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{listing.price?.value ? `${listing.price.value.toLocaleString('ro-RO')} ${listing.price.currency}` : 'Fără preț'}</span>
                        {listing.registrationYear && <span>An fabricație: {listing.registrationYear}</span>}
                        {listing.mileageKm && <span>{listing.mileageKm.toLocaleString('ro-RO')} km</span>}
                        {listing.updatedAt && <span>Actualizat: {new Date(listing.updatedAt).toLocaleString('ro-RO')}</span>}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingListing(listing);
                          setActiveTab('edit');
                        }}
                      >
                        Editează
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => updateStatus.mutate({ id: listing.id, status: listing.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' })}
                        disabled={updateStatus.isPending}
                      >
                        {listing.status === 'ACTIVE' ? 'Arhivează' : 'Activează'}
                      </Button>
                    </div>
                  </div>
                  {(() => {
                    const blocks = listing.description ? parseDescription(listing.description) : [];
                    if (!blocks.length) return null;
                    const previewBlocks = blocks.slice(0, 2);
                    return (
                      <div className="mt-3 max-h-32 space-y-2 overflow-hidden text-sm text-muted-foreground">
                        {previewBlocks.map((block, index) => {
                          if (block.type === 'list') {
                            return (
                              <ul key={`preview-list-${listing.id}-${index}`} className="list-disc space-y-1 pl-4">
                                {block.items.map((item, idx) => (
                                  <li key={idx} className="leading-relaxed">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            );
                          }
                          return (
                            <p key={`preview-paragraph-${listing.id}-${index}`} className="leading-relaxed">
                              {block.content}
                            </p>
                          );
                        })}
                      </div>
                    );
                  })()}
                  <Separator className="my-3" />
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {listing.highlightTags?.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              ))}
              {!sortedListings.length && !isLoading && (
                <p className="text-sm text-muted-foreground">Nu există anunțuri încă. Adaugă primul anunț cu butonul „Anunț nou”.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
