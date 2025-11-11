import { useMutation, useQuery } from '@tanstack/react-query';
import type { Part } from '../store/parts.slice';
import { setParts } from '../store/parts.slice';
import { useDispatch } from 'react-redux';
import { queryClient } from './queryClient';

export const QUERY_KEYS = {
  PARTS: ['[PARTS]'],
  REJECTIONS: ['[REJECTIONS]'],
};

const getPartsApi = async () => {
  const response = await fetch('/api/parts');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const getRejectionsApi = async () => {
  const response = await fetch('/api/rejections');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const createPartApi = async (part: Partial<Part>) => {
  const response = await fetch('/api/parts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(part),
  });

  if (!response.ok) {
    const error: Error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

const createRejectionApi = async (rejection: any) => {
  const response = await fetch('/api/rejections', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rejection),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useParts = () => {
  const dispatch = useDispatch();
  
  return useQuery<Part[]>({
    queryKey: QUERY_KEYS.PARTS,
    queryFn: getPartsApi,
    onSuccess: (data) => {
      dispatch(setParts(data));
    },
  });
};

export const useRejections = () => {
  return useQuery<any[]>({
    queryKey: QUERY_KEYS.REJECTIONS,
    queryFn: getRejectionsApi,
  });
};

export const useCreatePart = () => {
  return useMutation({
    mutationFn: createPartApi,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PARTS });
    },
  });
};

export const useCreateRejection = () => {
  return useMutation({
    mutationFn: createRejectionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REJECTIONS });
    },
  });
};
