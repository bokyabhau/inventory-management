import { useMutation, useQuery } from '@tanstack/react-query';
import { setParts } from '../store/parts.slice';
import { setRejections } from '../store/rejections.slice';
import { useDispatch } from 'react-redux';
import { queryClient } from './queryClient';
import type { Entity } from '../components/common/common.types';
import * as Api from './endpoints'

export const QUERY_KEYS = {
  PARTS: ['[PARTS]'],
  REJECTIONS: ['[REJECTIONS]'],
  DATA_ENTRIES: ['[DATA_ENTRIES]'],
  PREFERENCES: ['[PREFERENCES]'],
};


export const useParts = () => {
  const dispatch = useDispatch();

  return useQuery<Entity[]>({
    queryKey: QUERY_KEYS.PARTS,
    queryFn: Api.getPartsApi,
    onSuccess: (data) => {
      dispatch(setParts(data));
    },
  });
};

export const useCreatePart = () => {
  return useMutation({
    mutationFn: Api.createPartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTS });
    },
  });
};

export const useEditPart = () => {
  return useMutation({
    mutationFn: Api.editPartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTS });
    },
  });
};

export const useDeletePart = () => {
  return useMutation({
    mutationFn: Api.deletePartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTS });
    },
  });
}

export const useRejections = () => {
   const dispatch = useDispatch();
  return useQuery<Entity[]>({
    queryKey: QUERY_KEYS.REJECTIONS,
    queryFn: Api.getRejectionsApi,
    onSuccess: (data) => {
      dispatch(setRejections(data));
    }
  });
};

export const useCreateRejection = () => {
  return useMutation({
    mutationFn: Api.createRejectionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REJECTIONS });
    },
  });
};

export const useEditRejection = () => {
  return useMutation({
    mutationFn: Api.editRejectionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REJECTIONS });
    },
  });
}

export const useDeleteRejection = () => {
  return useMutation({
    mutationFn: Api.deleteRejectionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REJECTIONS });
    }
  });
}

export const useCreateDataEntry = () => {
  return useMutation({
    mutationFn: Api.createDataEntryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DATA_ENTRIES });
    },
  });
};

export const useDataEntries = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DATA_ENTRIES,
    queryFn: Api.getDataEntriesApi,
  });
};

export const useFilterDataEntries = (params: Api.FilterDataEntriesParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.DATA_ENTRIES, params],
    queryFn: () => Api.filterDataEntriesApi(params),
    enabled: !!(params.partName || params.startDate || params.endDate),
  });
};

// Preferences hooks
export const usePreferences = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PREFERENCES,
    queryFn: Api.getPreferencesApi,
  });
};

export const useCreatePreference = () => {
  return useMutation({
    mutationFn: Api.createPreferenceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PREFERENCES });
    },
  });
};

export const useUpdatePreference = () => {
  return useMutation({
    mutationFn: ({ name, value }: { name: string; value: string }) =>
      Api.updatePreferenceApi(name, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PREFERENCES });
    },
  });
};

export const useDeletePreference = () => {
  return useMutation({
    mutationFn: Api.deletePreferenceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PREFERENCES });
    },
  });
};