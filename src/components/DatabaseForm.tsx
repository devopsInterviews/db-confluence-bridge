import React, { useState } from 'react';
import { Database, Server, Play, Settings, FileText } from 'lucide-react';
import { DatabaseConfig, ConfluenceConfig } from './DatabaseSyncTool';

interface DatabaseFormProps {
  onSync: (dbConfig: DatabaseConfig, confluenceConfig: ConfluenceConfig) => void;
  isLoading: boolean;
}

export const DatabaseForm: React.FC<DatabaseFormProps> = ({ onSync, isLoading }) => {
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    type: 'postgresql',
    host: '127.0.0.1',
    port: 5432,
    user: 'malluser',
    password: 'mallpass',
    database: 'malldb',
    limit: 5,
  });

  const [confluenceConfig, setConfluenceConfig] = useState<ConfluenceConfig>({
    space: 'InT',
    title: 'Demo - database keys description',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSync(dbConfig, confluenceConfig);
  };

  const updateDbConfig = (field: keyof DatabaseConfig, value: string | number) => {
    setDbConfig(prev => ({ ...prev, [field]: value }));
  };

  const updateConfluenceConfig = (field: keyof ConfluenceConfig, value: string) => {
    setConfluenceConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Database Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Database Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`cursor-pointer border-2 rounded-xl p-4 smooth-transition ${
            dbConfig.type === 'postgresql' 
              ? 'border-primary bg-primary/10 glow-effect' 
              : 'border-border hover:border-primary/50'
          }`}>
            <input
              type="radio"
              name="dbType"
              value="postgresql"
              checked={dbConfig.type === 'postgresql'}
              onChange={(e) => updateDbConfig('type', e.target.value as 'postgresql' | 'mssql')}
              className="sr-only"
            />
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-primary" />
              <div>
                <div className="font-medium">PostgreSQL</div>
                <div className="text-sm text-muted-foreground">Open source SQL database</div>
              </div>
            </div>
          </label>

          <label className={`cursor-pointer border-2 rounded-xl p-4 smooth-transition ${
            dbConfig.type === 'mssql' 
              ? 'border-secondary bg-secondary/10 glow-effect' 
              : 'border-border hover:border-secondary/50'
          }`}>
            <input
              type="radio"
              name="dbType"
              value="mssql"
              checked={dbConfig.type === 'mssql'}
              onChange={(e) => updateDbConfig('type', e.target.value as 'postgresql' | 'mssql')}
              className="sr-only"
            />
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-secondary" />
              <div>
                <div className="font-medium">Microsoft SQL Server</div>
                <div className="text-sm text-muted-foreground">Enterprise SQL database</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Database Connection Settings */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Connection Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Host</label>
            <input
              type="text"
              value={dbConfig.host}
              onChange={(e) => updateDbConfig('host', e.target.value)}
              placeholder="Database host"
              className="db-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Port</label>
            <input
              type="number"
              value={dbConfig.port}
              onChange={(e) => updateDbConfig('port', parseInt(e.target.value) || 0)}
              placeholder={dbConfig.type === 'postgresql' ? '5432' : '1433'}
              className="db-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Username</label>
            <input
              type="text"
              value={dbConfig.user}
              onChange={(e) => updateDbConfig('user', e.target.value)}
              placeholder="Database username"
              className="db-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={dbConfig.password}
              onChange={(e) => updateDbConfig('password', e.target.value)}
              placeholder="Database password"
              className="db-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Database Name</label>
            <input
              type="text"
              value={dbConfig.database}
              onChange={(e) => updateDbConfig('database', e.target.value)}
              placeholder="Database name"
              className="db-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Sample Limit</label>
            <input
              type="number"
              value={dbConfig.limit}
              onChange={(e) => updateDbConfig('limit', parseInt(e.target.value) || 5)}
              placeholder="5"
              className="db-input"
              min="1"
              max="100"
              required
            />
          </div>
        </div>
      </div>

      {/* Confluence Settings */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Confluence Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Space Key</label>
            <input
              type="text"
              value={confluenceConfig.space}
              onChange={(e) => updateConfluenceConfig('space', e.target.value)}
              placeholder="Confluence space key"
              className="db-input"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-1">
            <label className="text-sm font-medium text-foreground">Page Title</label>
            <input
              type="text"
              value={confluenceConfig.title}
              onChange={(e) => updateConfluenceConfig('title', e.target.value)}
              placeholder="Documentation page title"
              className="db-input"
              required
            />
          </div>
        </div>
      </div>

      {/* Sync Button */}
      <div className="pt-6 border-t border-border">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full db-button-primary text-lg py-4 rounded-xl font-semibold flex items-center justify-center gap-3 glow-effect-strong disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Syncing Database...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Database Sync
            </>
          )}
        </button>
      </div>
    </form>
  );
};