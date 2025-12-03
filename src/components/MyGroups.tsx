import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Users, Target, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../contexts/AuthContext';
import { groupService, GroupResponse } from '../services/groupService';

interface MyGroup {
  id: number;
  name: string;
  creatorId: number;
  creatorName: string;
  description?: string;
  objective: string;
  currentMembers: number;
  maxMembers: number;
  targetAmount: number;
  currentAmount: number;
  category?: string;
  isPublic: boolean;
  groupType: 'saving' | 'investment';
  createdAt: string;
  deadline?: string;
  contributionFrequency?: string;
  minimumContribution?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  invitationCode?: string;
}

// Simple date formatter
const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export function MyGroups() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [myGroups, setMyGroups] = useState<MyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar grupos desde la API al montar
  useEffect(() => {
    if (isAuthenticated && user) {
      loadGroups();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const groups = await groupService.getMyGroups();
      // Convertir GroupResponse a MyGroup
      const convertedGroups: MyGroup[] = groups.map(g => ({
        id: g.id,
        name: g.name,
        creatorId: g.creatorId,
        creatorName: g.creatorName,
        description: g.description,
        objective: g.objective,
        currentMembers: g.currentMembers,
        maxMembers: g.maxMembers,
        targetAmount: Number(g.targetAmount),
        currentAmount: Number(g.currentAmount),
        category: g.category || '',
        isPublic: g.privacy === 'public',
        groupType: g.type as 'saving' | 'investment',
        createdAt: g.createdAt,
        deadline: g.deadline,
        contributionFrequency: g.contributionFrequency,
        minimumContribution: g.minimumContribution ? Number(g.minimumContribution) : undefined,
        riskLevel: g.riskLevel as 'low' | 'medium' | 'high' | undefined,
        invitationCode: g.invitationCode
      }));
      setMyGroups(convertedGroups);
    } catch (error: any) {
      console.error('Error al cargar grupos:', error);
      toast.error(error.response?.data?.message || 'Error al cargar los grupos');
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteGroup = async (groupId: number, groupName: string) => {
    if (!user) return;

    const group = myGroups.find(g => g.id === groupId);
    if (!group) return;

    // Verificar que el usuario es el creador
    if (Number(group.creatorId) !== Number(user.id)) {
      toast.error('No tienes permisos para eliminar este grupo');
      return;
    }

    try {
      await groupService.deleteGroup(groupId);
      toast.success(`Grupo "${groupName}" eliminado exitosamente`);
      // Recargar los grupos desde el backend
      await loadGroups();
    } catch (error: any) {
      console.error('Error al eliminar grupo:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar el grupo');
    }
  };

  const canEditOrDelete = (group: MyGroup) => {
    return user && Number(group.creatorId) === Number(user.id);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Educación': 'bg-yellow-100 text-yellow-800',
      'Viajes': 'bg-blue-100 text-blue-800',
      'Fondo de Emergencia': 'bg-red-100 text-red-800',
      'Jubilación': 'bg-purple-100 text-purple-800',
      'Negocio': 'bg-orange-100 text-orange-800',
      'Vivienda': 'bg-green-100 text-green-800',
      'Salud': 'bg-pink-100 text-pink-800',
      'Inversiones': 'bg-green-100 text-green-800',
      'Otro': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };


  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Debes iniciar sesión para ver tus grupos');
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando grupos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="mb-4">Mis Grupos</h1>
            <p className="text-muted-foreground">
              Administra los grupos que has creado
            </p>
          </div>
          <Button
            onClick={() => {
              if (!isAuthenticated) {
                toast.error('Debes iniciar sesión para crear grupos');
                navigate('/login');
              } else {
                navigate('/create-group');
              }
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear Nuevo Grupo
          </Button>
        </div>

        {/* Groups Grid */}
        {myGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((group) => {
              const canModify = canEditOrDelete(group);
              return (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={getCategoryColor(group.category)}>
                          {group.category}
                        </Badge>
                        <Badge variant="outline">
                          {group.isPublic ? 'Público' : 'Privado'}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {group.currentMembers}/{group.maxMembers}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {group.groupType === 'saving' ? 'Grupo de Ahorro' : 'Grupo de Inversión'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <Target className="h-4 w-4 mt-1 text-primary" />
                        <p className="text-sm">{group.objective}</p>
                      </div>
                      {group.description && (
                        <p className="text-xs text-muted-foreground mt-1">{group.description}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>
                          ${group.currentAmount.toLocaleString()} / ${group.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-secondary/30 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(group.currentAmount, group.targetAmount)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {getProgressPercentage(group.currentAmount, group.targetAmount).toFixed(1)}% completado
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => navigate(`/group/${group.id}`)}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                      {canModify && (
                        <>
                          <Button
                            onClick={() => navigate(`/edit-group/${group.id}`)}
                            variant="outline"
                            className="flex-1"
                            size="sm"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteGroup(group.id, group.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">No has creado ningún grupo todavía</p>
              <p className="text-sm">Crea tu primer grupo para comenzar a ahorrar o invertir de forma colaborativa</p>
            </div>
            <Button
              className="mt-4"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Debes iniciar sesión para crear grupos');
                  navigate('/login');
                } else {
                  navigate('/create-group');
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Grupo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
