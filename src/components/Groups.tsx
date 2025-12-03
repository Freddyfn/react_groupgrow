import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Users, Target, Lock, Search, UserPlus, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  creatorName: string;
  currentMembers: number;
  maxMembers: number;
  targetAmount: number;
  currentAmount: number;
  isMember: boolean; // Indica si el usuario actual es miembro
}

export function Groups() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [privateGroupCode, setPrivateGroupCode] = useState('');
  const [isJoiningPrivate, setIsJoiningPrivate] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // En una app real, el ID y nombre del usuario vendrían del contexto de autenticación
  const currentUserId = 1; // Simulación
  const currentUserName = 'María González'; // Simulación

  const fetchPublicGroupsData = async () => {
    try {

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Si hay token, incluirlo para que el backend pueda verificar membresía
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/v1/groups/public', {
        headers
      });

      if (!response.ok) {
        throw new Error('Error al cargar los grupos');
      }
      const data = await response.json();
      setGroups(data);
    } catch (err: any) {
      setError(err.message);
      toast.error('No se pudieron cargar los grupos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicGroupsData();
  }, []);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinPublicGroup = async (groupId: string) => {
    try {


      if (!token) {
        toast.error('Debes iniciar sesión para unirte a un grupo');
        navigate('/login');
        return;
      }

      const response = await fetch(`/api/v1/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al unirse al grupo');
      }

      toast.success('¡Te has unido al grupo exitosamente!');

      // Recargar la lista de grupos desde el backend para obtener datos actualizados
      await fetchPublicGroupsData();

      // Navegar al dashboard del grupo
      setTimeout(() => navigate(`/group/${groupId}`), 500);
    } catch (error: any) {
      toast.error(error.message || 'No se pudo unir al grupo. Inténtalo de nuevo.');
    }
  };

  const generatePrivateCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  const handleJoinPrivateGroup = async () => {
    if (!privateGroupCode.trim()) {
      toast.error('Por favor ingresa un código válido');
      return;
    }

    setIsJoiningPrivate(true);

    try {

      if (!token) {
        toast.error('Debes iniciar sesión para unirte a un grupo');
        navigate('/login');
        return;
      }

      const response = await fetch('/api/v1/groups/join-by-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ invitationCode: privateGroupCode }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al unirse al grupo');
      }

      toast.success('¡Te has unido al grupo exitosamente!');
      setPrivateGroupCode('');
      // Navegar a mis grupos para ver el nuevo grupo
      navigate('/my-groups');
    } catch (error: any) {
      toast.error(error.message || 'Código inválido o error al unirse.');
    } finally {
      setIsJoiningPrivate(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Viajes': 'bg-blue-100 text-blue-800',
      'Emergencia': 'bg-red-100 text-red-800',
      'Inversiones': 'bg-green-100 text-green-800',
      'Inmuebles': 'bg-purple-100 text-purple-800',
      'Educación': 'bg-yellow-100 text-yellow-800',
      'Emprendimiento': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando grupos...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }


  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4">Explorar Grupos</h1>
          <p className="text-muted-foreground">
            Descubre grupos públicos para unirte o accede a un grupo privado con código
          </p>
        </div>

        {/* Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Search Public Groups */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Grupos Públicos
                </CardTitle>
                <CardDescription>
                  Encuentra grupos públicos por nombre, creador, objetivo o categoría
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar grupos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Join Private Group */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Grupo Privado
                </CardTitle>
                <CardDescription>
                  Únete con código de invitación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="private-code" className="sr-only">Código de Grupo</Label>
                    <Input
                      id="private-code"
                      placeholder="Ingresa el código"
                      value={privateGroupCode}
                      onChange={(e) => setPrivateGroupCode(e.target.value.toUpperCase())}
                      maxLength={8}
                      className="uppercase tracking-wider"
                    />
                  </div>
                  <Button
                    onClick={handleJoinPrivateGroup}
                    disabled={isJoiningPrivate || !privateGroupCode.trim()}
                    className="w-full"
                  >
                    {isJoiningPrivate ? 'Verificando...' : 'Unirse con Código'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Public Groups Grid */}
        <div className="space-y-6">
          <h2 className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Grupos Públicos ({filteredGroups.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getCategoryColor(group.category)}>
                      {group.category}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        {group.currentMembers}/{group.maxMembers}
                      </div>
                      {group.creatorName === currentUserName && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-full"
                          onClick={() => navigate(`/edit-group/${group.id}`)}
                          title="Editar grupo"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription className="text-sm">
                    Creado por <strong>{group.creatorName}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <Target className="h-4 w-4 mt-1 text-primary" />
                      <p className="text-sm">{group.description}</p>
                    </div>
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

                  {group.isMember ? (
                    <Button
                      onClick={() => navigate(`/group/${group.id}`)}
                      className="w-full"
                      variant="secondary"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ya estás en el Grupo
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleJoinPublicGroup(group.id)}
                      className="w-full"
                      disabled={group.currentMembers >= group.maxMembers}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {group.currentMembers >= group.maxMembers ? 'Grupo Lleno' : 'Unirse al Grupo'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No se encontraron grupos que coincidan con tu búsqueda</p>
                <p className="text-sm">Intenta con otros términos o explora todas las categorías</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                className="mt-4"
              >
                Mostrar Todos los Grupos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}