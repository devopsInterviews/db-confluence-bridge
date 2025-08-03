import React, { useState } from 'react';
import { Database, Server, Loader, CheckCircle, AlertCircle, Coffee, Zap } from 'lucide-react';
import { DatabaseForm } from './DatabaseForm';
import { LoadingState } from './LoadingState';
import { ResultsTable } from './ResultsTable';
import { useToast } from '@/hooks/use-toast';

export interface DatabaseConfig {
  type: 'postgresql' | 'mssql';
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  limit: number;
}

export interface ConfluenceConfig {
  space: string;
  title: string;
}

export interface SyncResult {
  table: string;
  newColumns?: Array<{
    column: string;
    description: string;
  }>;
  error?: string;
}

export interface SyncResponse {
  results: SyncResult[];
}

export const DatabaseSyncTool: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SyncResult[] | null>(null);
  const { toast } = useToast();

  const handleSync = async (dbConfig: DatabaseConfig, confluenceConfig: ConfluenceConfig) => {
    setIsLoading(true);
    setResults(null);

    try {
      const payload = {
        ...dbConfig,
        ...confluenceConfig,
        port: dbConfig.port.toString(),
        limit: dbConfig.limit.toString()
      };

      const response = await fetch('/sync-all-tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Sync failed');
      }

      const data: SyncResponse = await response.json();
      setResults(data.results);
      
      toast({
        title: "Sync Complete!",
        description: `Successfully processed ${data.results.length} tables`,
        duration: 5000,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Sync Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12 slide-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary/20 rounded-xl glow-effect float-animation">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <Zap className="w-6 h-6 text-accent animate-pulse" />
            <div className="p-3 bg-secondary/20 rounded-xl glow-effect float-animation" style={{ animationDelay: '2s' }}>
              <Server className="w-8 h-8 text-secondary" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            Database Sync Tool
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Seamlessly sync your PostgreSQL and MSSQL database schemas to Confluence documentation. 
            <span className="text-accent font-medium"> Lightning fast.</span> 
            <span className="text-secondary font-medium"> Enterprise ready.</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Database Configuration Form */}
          <div className="xl:col-span-2">
            <div className="glass-card rounded-2xl p-8 slide-in-up stagger-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Database Configuration</h2>
              </div>
              
              <DatabaseForm onSync={handleSync} isLoading={isLoading} />
            </div>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="glass-card rounded-2xl p-6 slide-in-up stagger-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">Status</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Connection</span>
                  <span className="text-sm font-medium text-success">Ready</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Sync Status</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {isLoading ? 'Syncing...' : 'Idle'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted-foreground">Last Sync</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {results ? 'Just now' : 'Never'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-card rounded-2xl p-6 slide-in-up stagger-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <Server className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">Quick Stats</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {results?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Tables</div>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {results?.reduce((acc, r) => acc + (r.newColumns?.length || 0), 0) || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Columns</div>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="glass-card rounded-2xl p-6 slide-in-up stagger-4 border border-accent/30">
              <div className="flex items-center gap-3 mb-3">
                <Coffee className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-accent">Pro Tip</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Large databases? Grab a coffee! ☕ Our sync process intelligently samples your data 
                for optimal performance while maintaining accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8">
            <LoadingState />
          </div>
        )}

        {/* Results */}
        {results && !isLoading && (
          <div className="mt-8">
            <ResultsTable results={results} />
          </div>
        )}
      </div>
    </div>
  );
};