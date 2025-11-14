import type { Entity, EntityDto } from "../components/common/common.types";

export const getPartsApi = async () => {
  const response = await fetch('/api/parts');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createPartApi = async (part: EntityDto) => {
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

export const editPartApi = async (part: Entity) => {
  const response = await fetch(`/api/parts/${part.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: part.name }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export const deletePartApi = async (partId: string) => {
  const response = await fetch(`/api/parts/${partId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export const getRejectionsApi = async () => {
  const response = await fetch('/api/rejections');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createRejectionApi = async (rejection: Entity) => {
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

export const editRejectionApi = async (rejection: Entity) => {
  const response = await fetch(`/api/rejections/${rejection.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: rejection.name }),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const deleteRejectionApi = async (rejectionId: string) => {
  const response = await fetch(`/api/rejections/${rejectionId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}