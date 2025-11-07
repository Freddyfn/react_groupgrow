import axios from 'axios';

const API_BASE_URL = '/api/auth';

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

export interface UserProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  riskProfile: string;
  twofaEnabled: boolean;
  kycStatus: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  riskProfile?: string;
}

export const userService = {
  // Obtener perfil del usuario actual
  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await axios.get<UserProfileResponse>(
      `${API_BASE_URL}/profile`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Actualizar perfil del usuario
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
    const response = await axios.put<UserProfileResponse>(
      `${API_BASE_URL}/profile`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Desactivar 2FA
  disable2FA: async (): Promise<void> => {
    await axios.post(
      `${API_BASE_URL}/2fa/disable`,
      {},
      { headers: getAuthHeaders() }
    );
  }
};

