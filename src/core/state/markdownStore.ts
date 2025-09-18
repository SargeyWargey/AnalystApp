import { create } from 'zustand';

export interface ConversionJob {
  id: string;
  inputPath: string;
  outputPath: string;
  status: 'pending' | 'converting' | 'completed' | 'failed';
  progress: number;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
  debugLogs?: string[];
}

export interface DestinationFolder {
  id: string;
  path: string;
  name: string;
  isDefault: boolean;
}

interface MarkdownState {
  // File management
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  addSelectedFile: (file: string) => void;
  removeSelectedFile: (file: string) => void;
  clearSelectedFiles: () => void;

  // Destination folder management
  destinationFolders: DestinationFolder[];
  selectedDestinationId: string | null;
  setDestinationFolders: (folders: DestinationFolder[]) => void;
  addDestinationFolder: (folder: Omit<DestinationFolder, 'id'>) => void;
  removeDestinationFolder: (id: string) => void;
  setSelectedDestination: (id: string | null) => void;

  // Conversion jobs
  conversionJobs: ConversionJob[];
  setConversionJobs: (jobs: ConversionJob[]) => void;
  addConversionJob: (job: Omit<ConversionJob, 'id' | 'createdAt'>) => string;
  updateConversionJob: (id: string, updates: Partial<ConversionJob>) => void;
  addDebugLog: (id: string, message: string) => void;
  removeConversionJob: (id: string) => void;
  clearCompletedJobs: () => void;

  // UI state
  isConverting: boolean;
  setIsConverting: (converting: boolean) => void;
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
  showFileDialog: boolean;
  setShowFileDialog: (show: boolean) => void;

  // Supported file types (loaded from service)
  supportedExtensions: string[];
  setSupportedExtensions: (extensions: string[]) => void;
}

export const useMarkdownStore = create<MarkdownState>((set, get) => ({
  // File management
  selectedFiles: [],
  setSelectedFiles: (files) => set({ selectedFiles: files }),
  addSelectedFile: (file) => {
    const { selectedFiles } = get();
    if (!selectedFiles.includes(file)) {
      set({ selectedFiles: [...selectedFiles, file] });
    }
  },
  removeSelectedFile: (file) => {
    const { selectedFiles } = get();
    set({ selectedFiles: selectedFiles.filter(f => f !== file) });
  },
  clearSelectedFiles: () => set({ selectedFiles: [] }),

  // Destination folder management
  destinationFolders: [],
  selectedDestinationId: null,
  setDestinationFolders: (folders) => set({ destinationFolders: folders }),
  addDestinationFolder: (folder) => {
    const id = `dest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newFolder: DestinationFolder = { ...folder, id };
    const { destinationFolders } = get();

    // If this is the first folder or marked as default, make it the selected one
    const updatedFolders = [...destinationFolders, newFolder];
    if (updatedFolders.length === 1 || newFolder.isDefault) {
      set({
        destinationFolders: updatedFolders,
        selectedDestinationId: id
      });
    } else {
      set({ destinationFolders: updatedFolders });
    }
  },
  removeDestinationFolder: (id) => {
    const { destinationFolders, selectedDestinationId } = get();
    const updatedFolders = destinationFolders.filter(f => f.id !== id);

    set({
      destinationFolders: updatedFolders,
      selectedDestinationId: selectedDestinationId === id ?
        (updatedFolders.length > 0 ? updatedFolders[0].id : null) :
        selectedDestinationId
    });
  },
  setSelectedDestination: (id) => set({ selectedDestinationId: id }),

  // Conversion jobs
  conversionJobs: [],
  setConversionJobs: (jobs) => set({ conversionJobs: jobs }),
  addConversionJob: (job) => {
    const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newJob: ConversionJob = {
      ...job,
      id,
      createdAt: new Date()
    };
    const { conversionJobs } = get();
    set({ conversionJobs: [...conversionJobs, newJob] });
    return id;
  },
  updateConversionJob: (id, updates) => {
    const { conversionJobs } = get();
    const updatedJobs = conversionJobs.map(job =>
      job.id === id ? { ...job, ...updates } : job
    );
    set({ conversionJobs: updatedJobs });
  },
  addDebugLog: (id, message) => {
    const { conversionJobs } = get();
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    const updatedJobs = conversionJobs.map(job =>
      job.id === id ? {
        ...job,
        debugLogs: [...(job.debugLogs || []), logMessage]
      } : job
    );
    set({ conversionJobs: updatedJobs });
  },
  removeConversionJob: (id) => {
    const { conversionJobs } = get();
    set({ conversionJobs: conversionJobs.filter(job => job.id !== id) });
  },
  clearCompletedJobs: () => {
    const { conversionJobs } = get();
    const activeJobs = conversionJobs.filter(job =>
      job.status === 'pending' || job.status === 'converting'
    );
    set({ conversionJobs: activeJobs });
  },

  // UI state
  isConverting: false,
  setIsConverting: (converting) => set({ isConverting: converting }),
  dragActive: false,
  setDragActive: (active) => set({ dragActive: active }),
  showFileDialog: false,
  setShowFileDialog: (show) => set({ showFileDialog: show }),

  // Supported file types
  supportedExtensions: [],
  setSupportedExtensions: (extensions) => set({ supportedExtensions: extensions }),
}));