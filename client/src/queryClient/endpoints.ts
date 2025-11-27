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

export const createRejectionApi = async (rejection: EntityDto) => {
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

export interface RejectionItemDto {
  reason: string;
  numberOfRejections: number;
}

export interface DataEntryDto {
  date: string;
  shift: string;
  inspectorName: string;
  part: string;
  numberOfParts: number;
  rejections: RejectionItemDto[];
  lotNumber: string;
}

export const createDataEntryApi = async (dataEntry: DataEntryDto) => {
  const response = await fetch('/api/data-entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataEntry),
  });

  if (!response.ok) {
    const error: Error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const getDataEntriesApi = async () => {
  const response = await fetch('/api/data-entries');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export interface FilterDataEntriesParams {
  partName?: string;
  startDate?: string;
  endDate?: string;
  loadNumberStart?: string;
  loadNumberEnd?: string;
  inspectorName?: string;
  rejectionPercentageMin?: string;
  rejectionPercentageMax?: string;
  allParts?: string;
}

export const filterDataEntriesApi = async (params: FilterDataEntriesParams) => {
  const queryParams = new URLSearchParams();
  if (params.partName) queryParams.append('partName', params.partName);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.loadNumberStart) queryParams.append('loadNumberStart', params.loadNumberStart);
  if (params.loadNumberEnd) queryParams.append('loadNumberEnd', params.loadNumberEnd);
  if (params.inspectorName) queryParams.append('inspectorName', params.inspectorName);
  if (params.rejectionPercentageMin) queryParams.append('rejectionPercentageMin', params.rejectionPercentageMin);
  if (params.rejectionPercentageMax) queryParams.append('rejectionPercentageMax', params.rejectionPercentageMax);
  if (params.allParts) queryParams.append('allParts', params.allParts);

  const response = await fetch(`/api/data-entries/filter?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const updateDataEntryApi = async (id: string, dataEntry: DataEntryDto) => {
  const response = await fetch(`/api/data-entries/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataEntry),
  });

  if (!response.ok) {
    const error: Error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const deleteDataEntryApi = async (id: string) => {
  const response = await fetch(`/api/data-entries/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Preferences API
export interface PreferenceDto {
  name: string;
  value: string;
}

export const getPreferencesApi = async () => {
  const response = await fetch('/api/preferences');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getPreferenceApi = async (name: string) => {
  const response = await fetch(`/api/preferences/${name}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createPreferenceApi = async (preference: PreferenceDto) => {
  const response = await fetch('/api/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preference),
  });

  if (!response.ok) {
    const error: Error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const updatePreferenceApi = async (name: string, value: string) => {
  const response = await fetch(`/api/preferences/${name}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const deletePreferenceApi = async (name: string) => {
  const response = await fetch(`/api/preferences/${name}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};