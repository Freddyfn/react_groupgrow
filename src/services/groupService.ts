import axios from 'axios';

const API_BASE_URL = '/api/groups';

// Obtener token del localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Configurar axios con el token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

export interface CreateGroupRequest {
  name: string;
  type: 'saving' | 'investment';
  description?: string;
  goal: string;
  targetAmount: number;
  deadline?: string;
  maxMembers?: number;
  privacy: 'public' | 'private';
  invitationCode?: string;
  contributionFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'flexible';
  minimumContribution?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface UpdateGroupRequest {
  name?: string;
  type?: 'saving' | 'investment';
  description?: string;
  goal?: string;
  targetAmount?: number;
  deadline?: string;
  maxMembers?: number;
  privacy?: 'public' | 'private';
  invitationCode?: string;
  contributionFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'flexible';
  minimumContribution?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface GroupResponse {
  id: number;
  name: string;
  type: string;
  description?: string;
  objective: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  maxMembers: number;
  currentMembers: number;
  privacy: string;
  invitationCode?: string;
  contributionFrequency?: string;
  minimumContribution?: number;
  riskLevel?: string;
  category?: string;
  creatorId: number;
  creatorName: string;
  createdAt: string;
}

export const groupService = {
  // Crear grupo
  createGroup: async (data: CreateGroupRequest): Promise<GroupResponse> => {
    const response = await axios.post<GroupResponse>(
      API_BASE_URL,
      {
        ...data,
        targetAmount: data.targetAmount.toString(),
        minimumContribution: data.minimumContribution?.toString(),
        deadline: data.deadline || null
      },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Obtener mis grupos
  getMyGroups: async (): Promise<GroupResponse[]> => {
    const response = await axios.get<GroupResponse[]>(
      `${API_BASE_URL}/my-groups`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Obtener grupo por ID
  getGroupById: async (id: number): Promise<GroupResponse> => {
    const response = await axios.get<GroupResponse>(
      `${API_BASE_URL}/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Actualizar grupo
  updateGroup: async (id: number, data: UpdateGroupRequest): Promise<GroupResponse> => {
    const response = await axios.put<GroupResponse>(
      `${API_BASE_URL}/${id}`,
      {
        ...data,
        targetAmount: data.targetAmount?.toString(),
        minimumContribution: data.minimumContribution?.toString(),
        deadline: data.deadline || null
      },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Eliminar grupo
  deleteGroup: async (id: number): Promise<void> => {
    await axios.delete(
      `${API_BASE_URL}/${id}`,
      { headers: getAuthHeaders() }
    );
  }
};

